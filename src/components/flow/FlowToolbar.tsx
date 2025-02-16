
import { Button } from '../ui/button';
import { PlusCircle, Upload, ZoomIn, ZoomOut, Grid, Search, Copy, Paste } from 'lucide-react';
import { Panel, useReactFlow } from '@xyflow/react';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { Input } from '../ui/input';
import { useState } from 'react';

interface FlowToolbarProps {
  onAddNode: () => void;
  onSave: (name: string, folder: string) => void;
  onImportClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  appliances: string[];
}

export default function FlowToolbar({ 
  onAddNode, 
  onSave, 
  onImportClick, 
  onCopySelected,
  onPaste,
  appliances 
}: FlowToolbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showGrid, setShowGrid] = useState(true);
  const { zoomIn, zoomOut } = useReactFlow();

  return (
    <Panel position="top-left" className="bg-white p-2 rounded-lg shadow-sm flex gap-2 items-center flex-wrap">
      <div className="flex gap-2">
        <Button onClick={onAddNode} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Step
        </Button>
        <SaveWorkflowDialog onSave={onSave} appliances={appliances} />
        <Button 
          onClick={onImportClick}
          variant="secondary" 
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
      </div>
      
      <div className="h-6 w-px bg-gray-200" />
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => zoomIn()}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => zoomOut()}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowGrid(!showGrid)}
          className={showGrid ? 'bg-gray-100' : ''}
        >
          <Grid className="w-4 h-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCopySelected}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onPaste}
        >
          <Paste className="w-4 h-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 w-40"
        />
      </div>
    </Panel>
  );
}
