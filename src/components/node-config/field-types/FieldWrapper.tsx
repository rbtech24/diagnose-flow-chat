
import { Field } from '@/types/node-config';
import { Button } from '../../ui/button';
import { GripVertical, X } from 'lucide-react';

interface FieldWrapperProps {
  field: Field;
  index: number;
  children: React.ReactNode;
  onRemove: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

export function FieldWrapper({ field, index, children, onRemove, onMove }: FieldWrapperProps) {
  return (
    <div className="flex gap-2 items-start group border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <button 
        className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={(e) => {
          e.preventDefault();
          const target = e.currentTarget.parentElement;
          if (!target) return;
          
          const initialY = e.pageY;
          const initialIndex = index;
          
          const handleMouseMove = (moveEvent: MouseEvent) => {
            const currentY = moveEvent.pageY;
            const diff = currentY - initialY;
            const newIndex = initialIndex + Math.round(diff / 50);
            if (newIndex >= 0) {
              onMove(initialIndex, newIndex);
            }
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>
      
      <div className="flex-1">
        {children}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onRemove}
        className="hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
