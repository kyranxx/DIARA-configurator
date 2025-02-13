import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import type { BeadState, BeadAction, Bead, BeadPosition } from '../types';

// Initial state
const initialState: BeadState = {
  availableBeads: [],
  selectedBeads: [],
  selectedBeadIndex: null,
  isLoading: false,
  error: null,
};

// Error handling wrapper for reducer actions
const withErrorHandling = (fn: (state: BeadState, action: BeadAction) => BeadState) => 
  (state: BeadState, action: BeadAction): BeadState => {
    try {
      return fn(state, action);
    } catch (error) {
      console.error('Error in bead reducer:', error);
      return {
        ...state,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  };

// Reducer with error handling
const beadReducer = withErrorHandling((state: BeadState, action: BeadAction): BeadState => {
  switch (action.type) {
    case 'SET_AVAILABLE_BEADS':
      return {
        ...state,
        availableBeads: action.payload,
      };
    case 'ADD_SELECTED_BEAD':
      return {
        ...state,
        selectedBeads: [...state.selectedBeads, action.payload],
      };
    case 'UPDATE_BEAD_ROTATION':
      return {
        ...state,
        selectedBeads: state.selectedBeads.map((bead, index) =>
          index === action.payload.index
            ? { ...bead, rotation: action.payload.rotation }
            : bead
        ),
      };
    case 'SELECT_BEAD':
      return {
        ...state,
        selectedBeadIndex: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
});

// Context
const BeadContext = createContext<{
  state: BeadState;
  dispatch: React.Dispatch<BeadAction>;
} | null>(null);

// Provider component with error boundary
export function BeadProvider({ children }: { children: ReactNode }) {
  const [state, baseDispatch] = useReducer(beadReducer, initialState);

  // Wrap dispatch with error handling
  const dispatch = useCallback((action: BeadAction) => {
    try {
      baseDispatch(action);
    } catch (error) {
      console.error('Error dispatching action:', error);
      baseDispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }, []);

  // Clear error on unmount
  React.useEffect(() => {
    return () => {
      dispatch({ type: 'SET_ERROR', payload: null });
    };
  }, [dispatch]);

  if (state.error) {
    console.error('BeadContext Error:', state.error);
  }

  return (
    <BeadContext.Provider value={{ state, dispatch }}>
      {children}
    </BeadContext.Provider>
  );
}

// Custom hook with error handling
export function useBeadContext() {
  const context = useContext(BeadContext);
  if (!context) {
    const error = new Error('useBeadContext must be used within a BeadProvider');
    console.error(error);
    throw error;
  }
  return context;
}

// Action creators
export const beadActions = {
  setAvailableBeads: (beads: Bead[]) => ({
    type: 'SET_AVAILABLE_BEADS' as const,
    payload: beads,
  }),
  addSelectedBead: (bead: BeadPosition) => ({
    type: 'ADD_SELECTED_BEAD' as const,
    payload: bead,
  }),
  updateBeadRotation: (index: number, rotation: [number, number, number]) => ({
    type: 'UPDATE_BEAD_ROTATION' as const,
    payload: { index, rotation },
  }),
  selectBead: (index: number | null) => ({
    type: 'SELECT_BEAD' as const,
    payload: index,
  }),
  setLoading: (isLoading: boolean) => ({
    type: 'SET_LOADING' as const,
    payload: isLoading,
  }),
  setError: (error: string | null) => ({
    type: 'SET_ERROR' as const,
    payload: error,
  }),
};
