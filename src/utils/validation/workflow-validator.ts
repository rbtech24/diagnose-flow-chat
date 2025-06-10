
import { ValidationResult, ValidationSummary, ValidationContext } from '@/types/validation';
import { WORKFLOW_VALIDATION_RULES } from './workflow-rules';

export class WorkflowValidator {
  private context: ValidationContext;
  private results: ValidationResult[] = [];

  constructor(context: ValidationContext) {
    this.context = context;
  }

  validate(): ValidationSummary {
    this.results = [];
    
    // Run all validation rules
    this.validateStructure();
    this.validateContent();
    this.validateLogic();
    this.validateAccessibility();

    return this.generateSummary();
  }

  private validateStructure(): void {
    this.checkStartNodeRequired();
    this.checkOrphanedNodes();
    this.checkDeadEndPaths();
    this.checkCircularDependencies();
    this.checkUnreachableNodes();
  }

  private validateContent(): void {
    this.checkEmptyContent();
    this.checkMissingLabels();
    this.checkDuplicateLabels();
    this.checkQuestionWithoutOptions();
    this.checkTechnicalSpecsComplete();
  }

  private validateLogic(): void {
    this.checkUnbalancedBranches();
    this.checkMissingSolutionPaths();
    this.checkWorkflowLinkValidation();
  }

  private validateAccessibility(): void {
    this.checkMediaAltText();
    this.checkReadableContent();
  }

  private checkStartNodeRequired(): void {
    const hasStartNode = this.context.nodes.some(node => 
      node.data?.type === 'start' || 
      node.id === 'start-node' ||
      node.data?.label?.toLowerCase().includes('start')
    );

    if (!hasStartNode) {
      this.addResult({
        ruleId: 'start-node-required',
        severity: 'error',
        message: 'Workflow must have at least one start node',
        suggestion: 'Add a start node to begin your workflow',
        autoFixAvailable: true
      });
    }
  }

  private checkOrphanedNodes(): void {
    const connectedNodeIds = new Set<string>();
    
    // Get all connected nodes from edges
    this.context.edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    // Find orphaned nodes
    const orphanedNodes = this.context.nodes.filter(node => 
      !connectedNodeIds.has(node.id) && this.context.nodes.length > 1
    );

    orphanedNodes.forEach(node => {
      this.addResult({
        ruleId: 'orphaned-nodes',
        severity: 'warning',
        message: `Node "${node.data?.label || node.id}" is not connected to the workflow`,
        nodeId: node.id,
        suggestion: 'Connect this node to other nodes or remove it',
        autoFixAvailable: false
      });
    });
  }

  private checkDeadEndPaths(): void {
    const nodesWithOutgoing = new Set<string>();
    
    this.context.edges.forEach(edge => {
      nodesWithOutgoing.add(edge.source);
    });

    const questionNodes = this.context.nodes.filter(node => 
      node.data?.type === 'question' && !nodesWithOutgoing.has(node.id)
    );

    questionNodes.forEach(node => {
      this.addResult({
        ruleId: 'dead-end-paths',
        severity: 'warning',
        message: `Question node "${node.data?.label || node.id}" has no outgoing connections`,
        nodeId: node.id,
        suggestion: 'Add connections to guide users to the next step',
        autoFixAvailable: false
      });
    });
  }

  private checkCircularDependencies(): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = this.context.edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of this.context.nodes) {
      if (hasCycle(node.id)) {
        this.addResult({
          ruleId: 'circular-dependencies',
          severity: 'error',
          message: 'Circular dependency detected in workflow',
          nodeId: node.id,
          suggestion: 'Remove circular connections to create a clear flow',
          autoFixAvailable: false
        });
        break; // Only report once
      }
    }
  }

  private checkUnreachableNodes(): void {
    const reachableNodes = new Set<string>();
    const startNodes = this.context.nodes.filter(node => 
      node.data?.type === 'start' || 
      node.id === 'start-node' ||
      node.data?.label?.toLowerCase().includes('start')
    );

    const traverse = (nodeId: string) => {
      if (reachableNodes.has(nodeId)) return;
      reachableNodes.add(nodeId);
      
      const outgoingEdges = this.context.edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => traverse(edge.target));
    };

    startNodes.forEach(node => traverse(node.id));

    const unreachableNodes = this.context.nodes.filter(node => 
      !reachableNodes.has(node.id) && !startNodes.includes(node)
    );

    unreachableNodes.forEach(node => {
      this.addResult({
        ruleId: 'unreachable-nodes',
        severity: 'warning',
        message: `Node "${node.data?.label || node.id}" is unreachable from start nodes`,
        nodeId: node.id,
        suggestion: 'Connect this node to the main workflow path',
        autoFixAvailable: false
      });
    });
  }

  private checkEmptyContent(): void {
    this.context.nodes.forEach(node => {
      const hasContent = node.data?.content || 
                        node.data?.fields?.some((field: any) => field.content) ||
                        node.data?.label;

      if (!hasContent) {
        this.addResult({
          ruleId: 'empty-content',
          severity: 'warning',
          message: `Node "${node.id}" has no content`,
          nodeId: node.id,
          suggestion: 'Add meaningful content to guide users',
          autoFixAvailable: false
        });
      }
    });
  }

  private checkMissingLabels(): void {
    this.context.nodes.forEach(node => {
      if (!node.data?.label || node.data.label.trim() === '') {
        this.addResult({
          ruleId: 'missing-labels',
          severity: 'warning',
          message: `Node "${node.id}" is missing a descriptive label`,
          nodeId: node.id,
          suggestion: 'Add a clear, descriptive label',
          autoFixAvailable: false
        });
      }
    });
  }

  private checkDuplicateLabels(): void {
    const labelCount = new Map<string, string[]>();
    
    this.context.nodes.forEach(node => {
      const label = node.data?.label;
      if (label) {
        if (!labelCount.has(label)) {
          labelCount.set(label, []);
        }
        labelCount.get(label)!.push(node.id);
      }
    });

    labelCount.forEach((nodeIds, label) => {
      if (nodeIds.length > 1) {
        nodeIds.forEach(nodeId => {
          this.addResult({
            ruleId: 'duplicate-labels',
            severity: 'info',
            message: `Duplicate label "${label}" found`,
            nodeId,
            suggestion: 'Use unique labels for better clarity',
            autoFixAvailable: false
          });
        });
      }
    });
  }

  private checkQuestionWithoutOptions(): void {
    this.context.nodes.forEach(node => {
      if (node.data?.type === 'question') {
        const hasOptions = node.data?.options?.length > 0 ||
                          node.data?.fields?.some((field: any) => field.type === 'options' && field.options?.length > 0);

        if (!hasOptions) {
          this.addResult({
            ruleId: 'question-without-options',
            severity: 'error',
            message: `Question node "${node.data?.label || node.id}" has no response options`,
            nodeId: node.id,
            suggestion: 'Add response options (Yes/No, multiple choice, etc.)',
            autoFixAvailable: false
          });
        }
      }
    });
  }

  private checkTechnicalSpecsComplete(): void {
    this.context.nodes.forEach(node => {
      if (['test', 'measurement'].includes(node.data?.type)) {
        const specs = node.data?.technicalSpecs;
        if (!specs || !specs.range || specs.range.min === specs.range.max) {
          this.addResult({
            ruleId: 'technical-specs-incomplete',
            severity: 'warning',
            message: `Technical node "${node.data?.label || node.id}" has incomplete specifications`,
            nodeId: node.id,
            suggestion: 'Complete technical specifications for measurement ranges',
            autoFixAvailable: false
          });
        }
      }
    });
  }

  private checkUnbalancedBranches(): void {
    this.context.nodes.forEach(node => {
      if (node.data?.type === 'question') {
        const outgoingEdges = this.context.edges.filter(edge => edge.source === node.id);
        if (outgoingEdges.length === 1) {
          this.addResult({
            ruleId: 'unbalanced-branches',
            severity: 'info',
            message: `Question node "${node.data?.label || node.id}" has only one path`,
            nodeId: node.id,
            suggestion: 'Consider adding alternative paths for different responses',
            autoFixAvailable: false
          });
        }
      }
    });
  }

  private checkMissingSolutionPaths(): void {
    const solutionNodes = this.context.nodes.filter(node => node.data?.type === 'solution');
    if (solutionNodes.length === 0) {
      this.addResult({
        ruleId: 'missing-solution-paths',
        severity: 'warning',
        message: 'Workflow has no solution nodes',
        suggestion: 'Add solution nodes to provide resolutions for diagnostic paths',
        autoFixAvailable: false
      });
    }
  }

  private checkWorkflowLinkValidation(): void {
    this.context.nodes.forEach(node => {
      const workflowLinkFields = node.data?.fields?.filter((field: any) => field.type === 'workflow-link');
      workflowLinkFields?.forEach((field: any) => {
        if (field.content) {
          try {
            const linkData = JSON.parse(field.content);
            if (!linkData.workflowName) {
              this.addResult({
                ruleId: 'workflow-link-validation',
                severity: 'error',
                message: `Invalid workflow link in node "${node.data?.label || node.id}"`,
                nodeId: node.id,
                suggestion: 'Ensure workflow link has a valid target workflow',
                autoFixAvailable: false
              });
            }
          } catch {
            this.addResult({
              ruleId: 'workflow-link-validation',
              severity: 'error',
              message: `Malformed workflow link in node "${node.data?.label || node.id}"`,
              nodeId: node.id,
              suggestion: 'Fix the workflow link configuration',
              autoFixAvailable: false
            });
          }
        }
      });
    });
  }

  private checkMediaAltText(): void {
    this.context.nodes.forEach(node => {
      const mediaFields = node.data?.fields?.filter((field: any) => field.type === 'media');
      mediaFields?.forEach((field: any) => {
        field.media?.forEach((item: any) => {
          if (item.type === 'image' && !item.alt) {
            this.addResult({
              ruleId: 'media-alt-text',
              severity: 'warning',
              message: `Image in node "${node.data?.label || node.id}" is missing alt text`,
              nodeId: node.id,
              suggestion: 'Add descriptive alt text for accessibility',
              autoFixAvailable: false
            });
          }
        });
      });
    });
  }

  private checkReadableContent(): void {
    this.context.nodes.forEach(node => {
      const contentFields = node.data?.fields?.filter((field: any) => field.type === 'content');
      contentFields?.forEach((field: any) => {
        if (field.content && field.content.length < 10) {
          this.addResult({
            ruleId: 'readable-font-size',
            severity: 'info',
            message: `Content in node "${node.data?.label || node.id}" might be too brief`,
            nodeId: node.id,
            suggestion: 'Provide more detailed instructions for clarity',
            autoFixAvailable: false
          });
        }
      });
    });
  }

  private addResult(result: ValidationResult): void {
    this.results.push(result);
  }

  private generateSummary(): ValidationSummary {
    const errors = this.results.filter(r => r.severity === 'error').length;
    const warnings = this.results.filter(r => r.severity === 'warning').length;
    const infos = this.results.filter(r => r.severity === 'info').length;

    return {
      totalIssues: this.results.length,
      errors,
      warnings,
      infos,
      results: this.results,
      isValid: errors === 0
    };
  }
}

export function validateWorkflow(context: ValidationContext): ValidationSummary {
  const validator = new WorkflowValidator(context);
  return validator.validate();
}
