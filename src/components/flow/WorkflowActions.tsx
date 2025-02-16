
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link2 } from 'lucide-react';

export function WorkflowActions() {
  return (
    <Link 
      to="/workflows" 
      className="absolute top-4 right-4 z-50 translate-y-14"
    >
      <Button variant="secondary" className="gap-2">
        <Link2 className="h-4 w-4" />
        Workflows
      </Button>
    </Link>
  );
}
