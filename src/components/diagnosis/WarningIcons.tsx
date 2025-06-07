
import React from 'react';
import { AlertTriangle, Zap, Droplet, Flame } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type WarningType = 'electric' | 'water' | 'fire';

interface WarningIconProps {
  type: WarningType;
  includeLicenseText?: boolean;
  className?: string;
}

const warningMessages = {
  electric: {
    warning: "Warning! Risk Of Electric Shock Could Result In Serious Injury Or Death",
    license: "Licensing is often required to perform this test. Do not proceed unless you meet the licensing requirements for your area."
  },
  water: {
    warning: "Warning! Risk of Leak and Flooding",
    license: "Licensing is often required to perform this test. Do not proceed unless you meet the licensing requirements for your area."
  },
  fire: {
    warning: "Warning! Fire and Explosion Hazard",
    license: "Licensing is often required to perform this test. Do not proceed unless you meet the licensing requirements for your area."
  }
};

const getWarningIcon = (type: WarningType) => {
  switch (type) {
    case 'electric':
      return <Zap className="h-8 w-8 text-yellow-600" />;
    case 'water':
      return <Droplet className="h-8 w-8 text-blue-600" />;
    case 'fire':
      return <Flame className="h-8 w-8 text-red-600" />;
    default:
      return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
  }
};

const getWarningBackground = (type: WarningType) => {
  switch (type) {
    case 'electric':
      return 'bg-yellow-100 border-yellow-400';
    case 'water':
      return 'bg-blue-100 border-blue-400';
    case 'fire':
      return 'bg-red-100 border-red-400';
    default:
      return 'bg-yellow-100 border-yellow-400';
  }
};

export function WarningIcon({ type, includeLicenseText = false, className = "" }: WarningIconProps) {
  const message = warningMessages[type];
  const backgroundClass = getWarningBackground(type);
  
  return (
    <div className={`${backgroundClass} border-2 rounded-lg p-4 mb-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getWarningIcon(type)}
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 mb-1">
            {message.warning}
          </div>
          {includeLicenseText && (
            <div className="text-sm text-gray-700">
              {message.license}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WarningSelector({ 
  value, 
  onChange, 
  includeLicenseText = false,
  onLicenseTextChange 
}: {
  value?: WarningType;
  onChange: (type: WarningType | undefined) => void;
  includeLicenseText?: boolean;
  onLicenseTextChange?: (include: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Warning Type</label>
      <Select value={value || 'none'} onValueChange={(selectedValue) => {
        if (selectedValue === 'none') {
          onChange(undefined);
        } else {
          onChange(selectedValue as WarningType);
        }
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select warning type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Warning</SelectItem>
          <SelectItem value="electric">Electric Warning</SelectItem>
          <SelectItem value="water">Water Warning</SelectItem>
          <SelectItem value="fire">Fire Warning</SelectItem>
        </SelectContent>
      </Select>
      
      {value && onLicenseTextChange && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeLicense"
            checked={includeLicenseText}
            onChange={(e) => onLicenseTextChange(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="includeLicense" className="text-sm">
            Include licensing disclaimer
          </label>
        </div>
      )}
      
      {value && (
        <div className="mt-3">
          <label className="text-sm font-medium mb-2 block">Preview:</label>
          <WarningIcon 
            type={value} 
            includeLicenseText={includeLicenseText}
            className="text-xs"
          />
        </div>
      )}
    </div>
  );
}
