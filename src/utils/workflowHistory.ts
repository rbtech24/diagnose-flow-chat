
import { Node, Edge } from '@xyflow/react';

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
}

export interface HistoryState {
  past: WorkflowState[];
  present: WorkflowState;
  future: WorkflowState[];
}

const MAX_HISTORY_LENGTH = 50;

export const createHistoryState = (initialState: WorkflowState): HistoryState => ({
  past: [],
  present: initialState,
  future: [],
});

export const addToHistory = (history: HistoryState, newState: WorkflowState): HistoryState => {
  return {
    past: [...history.past.slice(-MAX_HISTORY_LENGTH), history.present],
    present: newState,
    future: [],
  };
};

export const undo = (history: HistoryState): HistoryState => {
  if (history.past.length === 0) return history;

  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, history.past.length - 1);

  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future],
  };
};

export const redo = (history: HistoryState): HistoryState => {
  if (history.future.length === 0) return history;

  const next = history.future[0];
  const newFuture = history.future.slice(1);

  return {
    past: [...history.past, history.present],
    present: next,
    future: newFuture,
  };
};
