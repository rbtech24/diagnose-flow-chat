
import { useRef } from 'react';

interface FlowFileInputProps {
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FlowFileInput({ onFileImport }: FlowFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <input 
      type="file" 
      ref={fileInputRef}
      className="hidden"
      accept=".json"
      onChange={onFileImport}
    />
  );
}
