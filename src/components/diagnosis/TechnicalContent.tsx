
import React from 'react';
import { TechnicalSpecs } from '@/types/node-config';

interface TechnicalContentProps {
  technicalSpecs: TechnicalSpecs;
  type: string;
}

export function TechnicalContent({ technicalSpecs, type }: TechnicalContentProps) {
  if (!technicalSpecs) return null;

  const renderSpecificContent = () => {
    switch (type) {
      case 'voltage-check':
        return (
          <div className="space-y-1">
            <div className="text-xs">Range: {technicalSpecs.range.min}V - {technicalSpecs.range.max}V</div>
            {technicalSpecs.testPoints && (
              <div className="text-xs">Test Points: {technicalSpecs.testPoints}</div>
            )}
          </div>
        );
      case 'resistance-check':
        return (
          <div className="space-y-1">
            <div className="text-xs">Range: {technicalSpecs.range.min}Ω - {technicalSpecs.range.max}Ω</div>
            {technicalSpecs.measurementPoints && (
              <div className="text-xs">Measurement: {technicalSpecs.measurementPoints}</div>
            )}
          </div>
        );
      case 'inspection':
        return (
          <div className="space-y-1">
            {technicalSpecs.points && (
              <div className="text-xs">Check Points: {technicalSpecs.points}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-2 p-2 bg-blue-50 rounded border text-gray-700">
      <div className="font-medium text-xs mb-1">Technical Specs</div>
      {renderSpecificContent()}
    </div>
  );
}
