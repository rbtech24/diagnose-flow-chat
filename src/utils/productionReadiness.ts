
// Production readiness checker to identify remaining issues

export interface ProductionIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'mock-data' | 'missing-implementation' | 'type-error' | 'database' | 'security';
  description: string;
  file?: string;
  recommendation: string;
}

export function checkProductionReadiness(): ProductionIssue[] {
  const issues: ProductionIssue[] = [];

  // Mock data files that should be removed
  const mockDataFiles = [
    'src/data/mockTechnicians.ts',
    'src/data/mockSupportTickets.ts',
    'src/data/mockFeatureRequests.ts',
    'src/data/mockCommunity.ts',
    'src/data/mockSubscriptions.ts'
  ];

  mockDataFiles.forEach(file => {
    issues.push({
      severity: 'critical',
      category: 'mock-data',
      description: `Mock data file still present: ${file}`,
      file,
      recommendation: 'Replace with real API integration or remove if no longer needed'
    });
  });

  // Type definition conflicts
  issues.push({
    severity: 'critical',
    category: 'type-error',
    description: 'Duplicate subscription type definitions',
    file: 'src/types/subscription.ts vs src/types/subscription-enhanced.ts',
    recommendation: 'Consolidate into single type definition file'
  });

  // Missing implementations
  const missingFeatures = [
    'Tech Calendar page',
    'Tech Notifications preferences',
    'Training Materials section',
    'Complete Knowledge Base implementation'
  ];

  missingFeatures.forEach(feature => {
    issues.push({
      severity: 'warning',
      category: 'missing-implementation',
      description: `Missing implementation: ${feature}`,
      recommendation: 'Implement feature or remove references from navigation'
    });
  });

  // Database schema issues
  issues.push({
    severity: 'critical',
    category: 'database',
    description: 'Missing RLS policies for several tables',
    recommendation: 'Implement proper Row Level Security policies'
  });

  issues.push({
    severity: 'warning',
    category: 'database',
    description: 'Inconsistent date field usage (trial_period vs trial_end_date)',
    recommendation: 'Standardize date field naming and usage'
  });

  return issues;
}

export function generateProductionReport(): string {
  const issues = checkProductionReadiness();
  
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');
  const infoIssues = issues.filter(i => i.severity === 'info');

  let report = '# Production Readiness Report\n\n';
  
  if (criticalIssues.length > 0) {
    report += '## Critical Issues (Must Fix Before Production)\n\n';
    criticalIssues.forEach(issue => {
      report += `- **${issue.category.toUpperCase()}**: ${issue.description}\n`;
      report += `  - Recommendation: ${issue.recommendation}\n`;
      if (issue.file) report += `  - File: ${issue.file}\n`;
      report += '\n';
    });
  }

  if (warningIssues.length > 0) {
    report += '## Warnings (Should Fix)\n\n';
    warningIssues.forEach(issue => {
      report += `- **${issue.category.toUpperCase()}**: ${issue.description}\n`;
      report += `  - Recommendation: ${issue.recommendation}\n`;
      if (issue.file) report += `  - File: ${issue.file}\n`;
      report += '\n';
    });
  }

  return report;
}
