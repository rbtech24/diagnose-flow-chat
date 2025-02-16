
import { useNodeConfig } from './node-config/useNodeConfig';
import { NodeConfigForm } from './node-config/NodeConfigForm';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

export default function NodeConfigPanel({ node, onUpdate }) {
  const {
    nodeType,
    label,
    fields,
    showTechnicalFields,
    technicalSpecs,
    handleNodeTypeChange,
    setLabel,
    setFields,
    setTechnicalSpecs,
    addField,
    removeField,
    moveField,
    handleReset,
    handleApplyChanges,
    validationErrors
  } = useNodeConfig({ node, onUpdate });

  if (!node) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a node to edit its properties
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Configuration</h2>
      
      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validationErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}
      
      <NodeConfigForm
        nodeType={nodeType}
        label={label}
        fields={fields}
        showTechnicalFields={showTechnicalFields}
        technicalSpecs={technicalSpecs}
        onNodeTypeChange={handleNodeTypeChange}
        onLabelChange={setLabel}
        onFieldsChange={setFields}
        onTechnicalSpecsChange={setTechnicalSpecs}
        onAddField={addField}
        onRemoveField={removeField}
        onMoveField={moveField}
        onReset={handleReset}
        onApply={handleApplyChanges}
        hasValidationErrors={validationErrors.length > 0}
      />
    </div>
  );
}
