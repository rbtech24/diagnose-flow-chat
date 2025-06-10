
import { Field } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { useState, useRef, useEffect } from 'react';

interface ContentFieldProps {
  field: Field;
  onFieldChange: (updatedField: Field) => void;
}

export function ContentField({ field, onFieldChange }: ContentFieldProps) {
  const [content, setContent] = useState(field.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Preserve cursor position when updating content
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [content, cursorPosition]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const currentCursor = e.target.selectionStart || 0;
    
    setContent(newContent);
    setCursorPosition(currentCursor);
    onFieldChange({ ...field, content: newContent });
  };

  // Handle special formatting when user presses Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const textBefore = content.substring(0, cursorPos);
      const textAfter = content.substring(cursorPos);
      
      // Get the current line
      const lines = textBefore.split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Check for bullet points (-, *, +) or numbered lists (1., 2., etc.)
      const bulletMatch = currentLine.match(/^(\s*)([-*+])\s/);
      const numberMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
      
      if (bulletMatch) {
        e.preventDefault();
        const [, indent, bullet] = bulletMatch;
        const newContent = textBefore + '\n' + indent + bullet + ' ' + textAfter;
        setContent(newContent);
        setCursorPosition(cursorPos + indent.length + 3); // +3 for \n + bullet + space
        onFieldChange({ ...field, content: newContent });
      } else if (numberMatch) {
        e.preventDefault();
        const [, indent, number] = numberMatch;
        const nextNumber = parseInt(number) + 1;
        const newContent = textBefore + '\n' + indent + nextNumber + '. ' + textAfter;
        setContent(newContent);
        setCursorPosition(cursorPos + indent.length + nextNumber.toString().length + 3); // +3 for \n + . + space
        onFieldChange({ ...field, content: newContent });
      }
    }
  };

  // Handle tab indentation for nested lists
  const handleKeyDownTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (e.shiftKey) {
        // Shift+Tab: Remove indentation
        const lines = content.split('\n');
        const startLine = content.substring(0, start).split('\n').length - 1;
        const endLine = content.substring(0, end).split('\n').length - 1;
        
        for (let i = startLine; i <= endLine; i++) {
          if (lines[i].startsWith('  ')) {
            lines[i] = lines[i].substring(2);
          }
        }
        
        const newContent = lines.join('\n');
        setContent(newContent);
        onFieldChange({ ...field, content: newContent });
      } else {
        // Tab: Add indentation
        const lines = content.split('\n');
        const startLine = content.substring(0, start).split('\n').length - 1;
        const endLine = content.substring(0, end).split('\n').length - 1;
        
        for (let i = startLine; i <= endLine; i++) {
          lines[i] = '  ' + lines[i];
        }
        
        const newContent = lines.join('\n');
        setContent(newContent);
        setCursorPosition(start + 2);
        onFieldChange({ ...field, content: newContent });
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Question or Instruction
      </Label>
      <div className="text-xs text-gray-500 mb-2">
        <div>Formatting tips:</div>
        <div>• Use "- ", "* ", or "+ " for bullet points</div>
        <div>• Use "1. ", "2. ", etc. for numbered lists</div>
        <div>• Press Tab to indent, Shift+Tab to outdent</div>
        <div>• Press Enter to continue lists automatically</div>
      </div>
      <Textarea 
        ref={textareaRef}
        placeholder="Enter the question or instruction text for this step"
        value={content}
        onChange={handleContentChange}
        onKeyDown={(e) => {
          handleKeyDown(e);
          handleKeyDownTab(e);
        }}
        className="min-h-[120px] resize-none font-mono text-sm leading-relaxed"
        style={{ 
          whiteSpace: 'pre-wrap',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        }}
      />
    </div>
  );
}
