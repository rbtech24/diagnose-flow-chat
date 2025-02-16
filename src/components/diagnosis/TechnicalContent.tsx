
import React from 'react';

interface TechnicalSpecs {
  range?: { min: number; max: number };
  testPoints?: string;
  value?: number;
  measurementPoints?: string;
  points?: string;
}

interface TechnicalContentProps {
  type?: string;
  technicalSpecs?: TechnicalSpecs;
}

export function TechnicalContent({ type, technicalSpecs }: TechnicalContentProps) {
  if (!technicalSpecs) return null;
  
  switch (type) {
    case 'voltage-check':
      return (
        <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
          <p>Expected: {technicalSpecs.range?.min}V - {technicalSpecs.range?.max}V</p>
          <p>Test Points: {technicalSpecs.testPoints}</p>
        </div>
      );
    case 'resistance-check':
      return (
        <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
          <p>Expected: {technicalSpecs.value}Ω</p>
          <p>Measure: {technicalSpecs.measurementPoints}</p>
        </div>
      );
    case 'inspection':
      return (
        <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
          <div dangerouslySetInnerHTML={{ 
            __html: technicalSpecs.points?.replace(/\n/g, '<br/>') || ''
          }} />
        </div>
      );
    default:
      return null;
  }
}
