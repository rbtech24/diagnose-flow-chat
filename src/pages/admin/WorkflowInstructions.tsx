
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminWorkflowInstructions() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Workflow Instructions</h1>
      <Card>
        <CardHeader>
          <CardTitle>How to Create and Manage Workflows</CardTitle>
          <CardDescription>
            Follow these instructions to effectively use the workflow editor.
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <h2>Creating a New Workflow</h2>
          <p>To create a new workflow, navigate to the "All Workflows" page and click the "Create Workflow" button. This will open the workflow editor with a blank canvas.</p>
          
          <h2>The Workflow Editor</h2>
          <p>The editor consists of a node palette on the left, a canvas in the center, and a configuration panel on the right.</p>
          <ul>
            <li><strong>Node Palette:</strong> Drag and drop different node types onto the canvas to build your workflow.</li>
            <li><strong>Canvas:</strong> Arrange your nodes and connect them by dragging from one node's handle to another.</li>
            <li><strong>Configuration Panel:</strong> Click on a node to open its configuration panel. Here you can set its title, content, options, and other properties.</li>
          </ul>

          <h2>Node Types</h2>
          <p>There are several types of nodes you can use:</p>
          <ul>
            <li><strong>Start:</strong> The entry point of your workflow.</li>
            <li><strong>Question:</strong> Poses a question with multiple choice options. Each option can lead to a different node.</li>
            <li><strong>Action:</strong> Represents a task or an action to be performed.</li>
            <li><strong>Solution:</strong> The final step in a diagnostic path, providing a solution.</li>
            <li><strong>Test:</strong> A node for performing a test.</li>
            <li><strong>Measurement:</strong> A node for taking a measurement.</li>
          </ul>
          
          <h2>Saving and Publishing</h2>
          <p>Your workflow is auto-saved as you make changes. When you are ready, you can publish it to make it available for technicians.</p>
        </CardContent>
      </Card>
    </div>
  );
}
