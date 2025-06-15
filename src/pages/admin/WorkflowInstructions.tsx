
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
          <h2>Introduction to Workflows</h2>
          <p>Workflows are step-by-step guides that help technicians diagnose and resolve issues. They are built using a visual editor where you can connect different types of steps (nodes) to create a flow chart for a specific problem.</p>

          <h2>Creating a New Workflow</h2>
          <p>To create a new workflow, navigate to the <a href="/admin/workflows">Workflows</a> page and click the "Create Workflow" button. This will open the workflow editor with a blank canvas. You can also start from a template if available.</p>
          
          <h2>The Workflow Editor Interface</h2>
          <p>The editor is your main workspace for building workflows. It consists of a few key areas:</p>
          <ul>
            <li><strong>Canvas:</strong> The central area where you build your workflow. You can pan around by clicking and dragging on an empty area, and zoom in and out using your mouse wheel or trackpad.</li>
            <li><strong>Node Palette:</strong> Located on the left, this panel contains all the available node types you can drag onto the canvas.</li>
            <li><strong>Toolbar:</strong> At the top or side of the canvas, you'll find tools for saving, adding nodes, managing versions, and more.</li>
            <li><strong>Configuration Panel:</strong> This panel appears on the right when you select a node. Here you can configure all the details for that specific step in the workflow.</li>
          </ul>

          <h3>Keyboard Shortcuts</h3>
          <p>Speed up your workflow creation with these shortcuts:</p>
          <ul>
            <li><strong>Copy Node(s):</strong> <kbd>Ctrl</kbd> + <kbd>C</kbd> (or <kbd>Cmd</kbd> + <kbd>C</kbd>)</li>
            <li><strong>Paste Node(s):</strong> <kbd>Ctrl</kbd> + <kbd>V</kbd> (or <kbd>Cmd</kbd> + <kbd>V</kbd>)</li>
            <li><strong>Quick Save:</strong> <kbd>Ctrl</kbd> + <kbd>S</kbd> (or <kbd>Cmd</kbd> + <kbd>S</kbd>) for existing workflows.</li>
            <li><strong>Delete Node(s):</strong> <kbd>Delete</kbd> or <kbd>Backspace</kbd> when nodes are selected.</li>
          </ul>

          <h2>Understanding Nodes</h2>
          <p>Nodes are the building blocks of your workflow. Each node represents a specific type of action or information.</p>
          <h3>Node Types</h3>
          <ul>
            <li><strong>Start:</strong> The entry point of your workflow. Every workflow must have one.</li>
            <li><strong>Question:</strong> Poses a question with multiple choice options. Each option can lead to a different node, creating branches in your logic.</li>
            <li><strong>Action:</strong> Describes a task or an action that needs to be performed, like "Check the filter".</li>
            <li><strong>Solution:</strong> The final step in a diagnostic path, providing a solution or conclusion.</li>
            <li><strong>Test:</strong> A node for performing a specific test, which can have defined parameters and expected results.</li>
            <li><strong>Measurement:</strong> A node for taking a measurement, often with a specified range of acceptable values.</li>
            <li><strong>Data Collection:</strong> A form to collect specific data from the technician.</li>
            <li><strong>Decision Tree:</strong> A more complex branching node based on multiple conditions.</li>
          </ul>

          <h3>Configuring Nodes</h3>
          <p>When you select a node on the canvas, its configuration panel opens. Here are some of the common fields you'll use:</p>
          <ul>
            <li><strong>Title:</strong> The main heading for the node, displayed prominently.</li>
            <li><strong>Content:</strong> The main text or instructions for the node. You can use markdown for formatting.</li>
            <li><strong>Media:</strong> Upload images, videos, or PDFs to provide visual aids. This is great for showing diagrams or short instructional clips.</li>
            <li><strong>Options:</strong> For "Question" nodes, this is where you define the choices. For each choice, you can specify the text that will appear on the button.</li>
            <li><strong>Technical Specs:</strong> For "Test" and "Measurement" nodes, you can specify technical details like value ranges, test points, and units.</li>
            <li><strong>Workflow Link:</strong> This allows you to link from one workflow to another, making your workflows modular.</li>
          </ul>

          <h2>Connecting Nodes</h2>
          <p>To create the flow of your workflow, you need to connect your nodes.</p>
          <ul>
            <li>Nodes have connection points called <strong>handles</strong>. Handles on the right side are typically <strong>sources</strong> (outgoing connections), and handles on the left are <strong>targets</strong> (incoming connections). Question nodes may have multiple source handles, one for each option.</li>
            <li>To create a connection, click and drag from a source handle on one node to a target handle on another. A line (called an edge) will be drawn between them.</li>
            <li>To delete a connection, you can select the edge and press the <kbd>Delete</kbd> key, or sometimes click on the edge to reveal a delete button.</li>
          </ul>

          <h2>Managing Workflows in the Admin Panel</h2>
          <p>From the main <a href="/admin/workflows">Workflows</a> page in the admin panel, you have several management options:</p>
          <ul>
            <li><strong>Activate/Deactivate:</strong> Use the toggle switch to make a workflow active (available to technicians) or inactive.</li>
            <li><strong>Reorder:</strong> Click the "Reorder Workflows" button to enter a mode where you can drag and drop workflows to change their display order.</li>
            <li><strong>Edit:</strong> Click the "Edit" button to open the workflow in the editor.</li>
            <li><strong>Delete:</strong> Permanently remove a workflow. This action cannot be undone.</li>
            <li><strong>Search:</strong> Use the search bar to quickly find workflows by name or folder.</li>
          </ul>

          <h2>Saving and Versioning in the Editor</h2>
          <p>Your progress is important. Here's how to manage it while editing:</p>
          <ul>
            <li><strong>Auto-Save:</strong> For existing workflows, your changes are auto-saved periodically to prevent data loss. Look for an indicator in the editor UI.</li>
            <li><strong>Quick Save:</strong> Use <kbd>Ctrl</kbd>+<kbd>S</kbd> or the Quick Save button to manually save your current progress to the existing workflow file.</li>
            <li><strong>Save Workflow As:</strong> When you first create a workflow, or if you want to save a copy, you'll use the "Save" or "Save As" dialog. You'll need to provide a name and select a folder/category.</li>
            <li><strong>Version History:</strong> The editor automatically saves versions of your workflow as you work. You can access the version history to view or restore previous states of your workflow.</li>
            <li><strong>Import/Export:</strong> You can export a workflow to a file as a backup or to share it. You can also import a workflow file to the editor.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
