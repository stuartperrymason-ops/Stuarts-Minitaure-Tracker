import { useState, useCallback, useEffect } from 'react';

// The full history state object structure, now exported for type checking in other files.
export interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

// Custom hook for managing state history with undo/redo and FULL localStorage persistence.
export function useHistory<T>(key: string, initialValue: T) {
    const [state, setState] = useState<HistoryState<T>>(() => {
        try {
            const item = window.localStorage.getItem(key);
            // If there's a stored item, parse it and use it as the initial state.
            if (item) {
                const savedState = JSON.parse(item);
                // Basic validation to ensure the loaded state has the correct shape.
                if (savedState.hasOwnProperty('present') && savedState.hasOwnProperty('past') && savedState.hasOwnProperty('future')) {
                    return savedState;
                }
            }
            // Otherwise, initialize with the provided initial value.
            return { past: [], present: initialValue, future: [] };
        } catch (error) {
            console.error("Error reading from localStorage", error);
            // Fallback to a clean initial state on error.
            return { past: [], present: initialValue, future: [] };
        }
    });

    // Persist the entire history state object to localStorage whenever it changes.
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [key, state]);

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = useCallback(() => {
        if (!canUndo) return;
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, state.past.length - 1);
        setState({
            past: newPast,
            present: previous,
            future: [state.present, ...state.future]
        });
    }, [canUndo, state]);

    const redo = useCallback(() => {
        if (!canRedo) return;
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        setState({
            past: [...state.past, state.present],
            present: next,
            future: newFuture
        });
    }, [canRedo, state]);

    const set = useCallback((newState: T | ((prevState: T) => T)) => {
        const nextState = typeof newState === 'function' 
            ? (newState as (prevState: T) => T)(state.present) 
            : newState;
        
        if (JSON.stringify(nextState) === JSON.stringify(state.present)) return;

        setState({
            past: [...state.past, state.present],
            present: nextState,
            future: []
        });
    }, [state.present]);

    const restoreState = useCallback((newState: HistoryState<T>) => {
        // Directly sets the entire history state, used for loading from a file.
        setState(newState);
    }, []);

    return {
        state: state.present,
        fullState: state, // Expose the entire state object for saving.
        set,
        restoreState, // Expose the restore function for loading.
        undo,
        redo,
        canUndo,
        canRedo,
    };
}
