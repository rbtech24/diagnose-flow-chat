
import { useSearchParams } from 'react-router-dom';
import FlowEditor from '@/components/FlowEditor';

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const folder = searchParams.get('folder');
  const name = searchParams.get('name');

  return (
    <div className="h-screen">
      <FlowEditor 
        folder={folder || ''} 
        name={name || ''} 
        appliances={[]} 
        onNodeSelect={(node, updateNode) => {}} 
      />
    </div>
  );
}
