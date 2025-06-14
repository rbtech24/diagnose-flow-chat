
import { cn } from '@/lib/utils';

export const nodeStyles: Record<string, { bg: string, border: string, dot: string }> = {
  start:          { bg: 'bg-gradient-to-br from-green-50 to-green-100',   border: 'border-green-600', dot: 'bg-green-400' },
  question:       { bg: 'bg-gradient-to-br from-blue-50 to-blue-100',    border: 'border-blue-500', dot: 'bg-blue-400' },
  choice:         { bg: 'bg-gradient-to-br from-sky-50 to-sky-100',      border: 'border-sky-500', dot: 'bg-sky-400' },
  instruction:    { bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100', border: 'border-yellow-500', dot: 'bg-yellow-400' },
  condition:      { bg: 'bg-gradient-to-br from-orange-50 to-orange-100', border: 'border-orange-500', dot: 'bg-orange-400' },
  result:         { bg: 'bg-gradient-to-br from-green-100 to-green-200',  border: 'border-green-600', dot: 'bg-green-400' },
  end:            { bg: 'bg-gradient-to-br from-green-100 to-green-200',  border: 'border-green-600', dot: 'bg-green-400' },
  media:          { bg: 'bg-gradient-to-br from-purple-50 to-purple-100', border: 'border-purple-500', dot: 'bg-purple-400' },
  'photo-capture':{ bg: 'bg-gradient-to-br from-teal-50 to-teal-100',    border: 'border-teal-500', dot: 'bg-teal-400' },
  decision:       { bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', border: 'border-indigo-500', dot: 'bg-indigo-400' },
  'decision-tree':{ bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', border: 'border-indigo-500', dot: 'bg-indigo-400' },
  warning:        { bg: 'bg-gradient-to-br from-red-50 to-red-100',      border: 'border-red-500', dot: 'bg-red-400' },
  info:           { bg: 'bg-gradient-to-br from-gray-50 to-gray-100',     border: 'border-gray-500', dot: 'bg-gray-400' },
  action:         { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', border: 'border-emerald-500', dot: 'bg-emerald-400' },
  workflow:       { bg: 'bg-gradient-to-br from-slate-50 to-slate-100',   border: 'border-slate-500', dot: 'bg-slate-400' },
  'data-form':    { bg: 'bg-gradient-to-br from-amber-50 to-amber-100',  border: 'border-amber-500', dot: 'bg-amber-400' },
  'data-collection':{ bg: 'bg-gradient-to-br from-amber-50 to-amber-100',  border: 'border-amber-500', dot: 'bg-amber-400' },
  'equipment-test': { bg: 'bg-gradient-to-br from-rose-50 to-rose-100',    border: 'border-rose-500', dot: 'bg-rose-400' },
  'multi-branch':   { bg: 'bg-gradient-to-br from-pink-50 to-pink-100',    border: 'border-pink-500', dot: 'bg-pink-400' },
  'procedure-step': { bg: 'bg-gradient-to-br from-lime-50 to-lime-100',   border: 'border-lime-500', dot: 'bg-lime-400' },
  default:        { bg: 'bg-gradient-to-br from-gray-50 to-gray-100',     border: 'border-gray-500', dot: 'bg-gray-400' }
};

export const getNodeStyle = (type?: string) => {
  return nodeStyles[type || 'default'] || nodeStyles.default;
};

export const getNodeClasses = (type?: string) => {
    const style = getNodeStyle(type);
    return cn(style.bg, style.border);
}
