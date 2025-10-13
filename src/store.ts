/**
 * @file src/store.ts
 * This file defines the central Zustand store for the application.
 * It manages all global state and actions, providing a single source of truth.
 * Zustand is a small, fast, and scalable state-management solution.
 * We use the `immer` middleware to allow for safe and easy immutable state updates.
 */

import { create } from 'zustand';
// FIX: Module '"zustand/middleware"' has no exported member 'immer'. Correct the import path for the immer middleware.
import { immer } from 'zustand/middleware/immer';
import { Miniature, Filter, Status } from './types';
import { THEMES, DEFAULT_THEME, Theme, ARMY_THEMES } from './themes';

// Defines the structure for sorting configuration.
export type SortConfig = {
    key: keyof Miniature;
    direction: 'asc' | 'desc';
};

// Interface for the state managed by the store.
interface AppState {
    miniatures: Miniature[];
    gameSystems: string[];
    editingMiniature: Miniature | null;
    isFormVisible: boolean;
    filters: Filter;
    searchQuery: string;
    sortConfig: SortConfig;
}

// Interface for the actions (functions) that can modify the state.
interface AppActions {
    // Data fetching
    fetchInitialData: () => Promise<void>;
    addGameSystem: (name: string) => Promise<boolean>;
    
    // Filtering and Sorting
    setFilters: (filters: Partial<Filter>) => void;
    setSearchQuery: (query: string) => void;
    handleSort: (key: keyof Miniature) => void;
    
    // CRUD operations for Miniatures
    addMiniature: (miniature: Omit<Miniature, 'id'>) => Promise<void>;
    updateMiniature: (updatedMiniature: Miniature) => Promise<void>;
    deleteMiniature: (id: string) => Promise<void>;
    
    // Form visibility and editing state
    showFormForAddNew: () => void;
    showFormForEdit: (miniature: Miniature) => void;
    hideForm: () => void;
    
    // Bulk actions
    bulkUpdate: (ids: string[], updates: Partial<Omit<Miniature, 'id'>>) => Promise<void>;
    bulkDelete: (ids: string[]) => Promise<void>;
    bulkImport: (newMinis: Omit<Miniature, 'id'>[]) => Promise<void>;
}

// The initial state of the application.
const initialState: AppState = {
    miniatures: [],
    gameSystems: [],
    editingMiniature: null,
    isFormVisible: false,
    filters: { gameSystem: 'all', army: '' },
    searchQuery: '',
    sortConfig: { key: 'modelName', direction: 'asc' },
};

// Create the Zustand store using the `immer` middleware for immutable updates.
const useStore = create<AppState & AppActions>()(
    immer((set, get) => ({
        ...initialState,
        
        // --- ACTIONS ---

        fetchInitialData: async () => {
            try {
                const [miniaturesResponse, gameSystemsResponse] = await Promise.all([
                    fetch('/api/miniatures'),
                    fetch('/api/gamesystems')
                ]);

                if (!miniaturesResponse.ok) throw new Error('Network response for miniatures was not ok');
                const miniaturesData: Miniature[] = await miniaturesResponse.json();

                if (!gameSystemsResponse.ok) throw new Error('Network response for game systems was not ok');
                const gameSystemsData: string[] = await gameSystemsResponse.json();
                
                set(state => {
                    state.miniatures = miniaturesData;
                    state.gameSystems = gameSystemsData;
                });

            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            }
        },

        addGameSystem: async (name: string) => {
            try {
                const response = await fetch('/api/gamesystems', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                });
                if (response.status === 409) {
                    alert('Game system already exists.');
                    return false;
                }
                if (!response.ok) throw new Error('Failed to add game system');
                const newGameSystem = await response.json();
                set(state => {
                    state.gameSystems.push(newGameSystem.name);
                    state.gameSystems.sort();
                });
                return true;
            } catch (error) {
                console.error(error);
                alert('Error: Could not save game system to the database.');
                return false;
            }
        },
        
        setFilters: (newFilters) => set(state => { 
            state.filters = { ...state.filters, ...newFilters };
        }),
        setSearchQuery: (query) => set(state => { state.searchQuery = query; }),
        
        handleSort: (key) => set(state => {
            const { sortConfig } = state;
            state.sortConfig = {
                key,
                direction: sortConfig && sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
            };
        }),

        addMiniature: async (miniature) => {
            try {
                const response = await fetch('/api/miniatures', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(miniature),
                });
                if (!response.ok) throw new Error('Failed to add miniature');
                const savedMiniature = await response.json();
                set(state => {
                    state.miniatures.push(savedMiniature);
                    state.isFormVisible = false;
                });
            } catch (error) {
                console.error(error);
                alert('Error: Could not save miniature to the database.');
            }
        },

        updateMiniature: async (updatedMiniature) => {
            try {
                const response = await fetch(`/api/miniatures/${updatedMiniature.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedMiniature),
                });
                if (!response.ok) throw new Error('Failed to update miniature');
                set(state => {
                    const index = state.miniatures.findIndex(m => m.id === updatedMiniature.id);
                    if (index !== -1) {
                        state.miniatures[index] = updatedMiniature;
                    }
                    state.editingMiniature = null;
                    state.isFormVisible = false;
                });
            } catch (error) {
                console.error(error);
                alert('Error: Could not update miniature in the database.');
            }
        },
        
        deleteMiniature: async (id) => {
             if (window.confirm('Are you sure you want to delete this miniature entry? This action cannot be undone.')) {
                try {
                    const response = await fetch(`/api/miniatures/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete miniature');
                    set(state => {
                        state.miniatures = state.miniatures.filter(m => m.id !== id);
                    });
                } catch (error) {
                    console.error(error);
                    alert('Error: Could not delete miniature from the database.');
                }
            }
        },

        showFormForAddNew: () => set(state => {
            state.editingMiniature = null;
            state.isFormVisible = true;
        }),
        
        showFormForEdit: (miniature) => set(state => {
            state.editingMiniature = miniature;
            state.isFormVisible = true;
        }),
        
        hideForm: () => set(state => {
            state.editingMiniature = null;
            state.isFormVisible = false;
        }),
        
        bulkUpdate: async (ids, updates) => {
            const originalMiniatures = get().miniatures;
            // Optimistic update
            set(state => {
                state.miniatures = state.miniatures.map(m => (ids.includes(m.id) ? { ...m, ...updates } : m));
            });
            try {
                const response = await fetch('/api/miniatures/bulk', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids, updates }),
                });
                if (!response.ok) throw new Error('Bulk update failed on the server.');
            } catch (error) {
                console.error(error);
                alert('Error: Could not bulk update miniatures. Reverting changes.');
                set(state => { state.miniatures = originalMiniatures; });
            }
        },
        
        bulkDelete: async (ids) => {
            const originalMiniatures = get().miniatures;
            // Optimistic update
            set(state => {
                state.miniatures = state.miniatures.filter(m => !ids.includes(m.id));
            });
            try {
                const response = await fetch('/api/miniatures/bulk', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids }),
                });
                if (!response.ok) throw new Error('Bulk delete failed on the server.');
            } catch (error) {
                console.error(error);
                alert('Error: Could not bulk delete miniatures. Reverting changes.');
                set(state => { state.miniatures = originalMiniatures; });
            }
        },
        
        bulkImport: async (newMinis) => {
             try {
                const response = await fetch('/api/miniatures/bulk-import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMinis),
                });
                if (!response.ok) throw new Error('Failed to import miniatures to the database.');
                const imported = await response.json();
                set(state => {
                    state.miniatures.push(...imported);
                });
            } catch(error) {
                console.error(error);
                throw error; // re-throw to be caught in component
            }
        }
    }))
);

// --- SELECTORS ---
// Selectors are functions that compute derived state. They are defined outside the store
// for better organization and can be memoized for performance if calculations are expensive.

const selectFilteredMiniatures = (state: AppState): Miniature[] => {
    let result = [...state.miniatures];
    const { filters, searchQuery, sortConfig } = state;

    // Apply filters
    if (filters.gameSystem !== 'all') {
        result = result.filter(m => m.gameSystem === filters.gameSystem);
    }
    if (filters.army) {
        result = result.filter(m => m.army.toLowerCase().includes(filters.army.toLowerCase()));
    }

    // Apply search query
    if (searchQuery.trim()) {
        const lowercasedQuery = searchQuery.toLowerCase();
        result = result.filter(m =>
            m.modelName.toLowerCase().includes(lowercasedQuery) ||
            m.gameSystem.toLowerCase().includes(lowercasedQuery) ||
            m.army.toLowerCase().includes(lowercasedQuery) ||
            (m.notes && m.notes.toLowerCase().includes(lowercasedQuery))
        );
    }

    // Apply sorting
    result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
        }
        return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return result;
};

const selectActiveTheme = (state: AppState): Theme => {
    const { filters } = state;
    if (filters.army) {
        const lowercasedArmy = filters.army.toLowerCase().trim();
        if (lowercasedArmy) {
            if (filters.gameSystem !== 'all') {
                const armyThemesForSystem = ARMY_THEMES[filters.gameSystem];
                if (armyThemesForSystem) {
                    const armyThemeKey = Object.keys(armyThemesForSystem).find(key => key.toLowerCase() === lowercasedArmy);
                    if (armyThemeKey) {
                        const baseTheme = THEMES[filters.gameSystem] || DEFAULT_THEME;
                        const armyOverrides = armyThemesForSystem[armyThemeKey];
                        return { ...baseTheme, ...armyOverrides };
                    }
                }
            } else {
                for (const gameSystem in ARMY_THEMES) {
                    const armyThemesForSystem = ARMY_THEMES[gameSystem];
                    if (armyThemesForSystem) {
                        const armyThemeKey = Object.keys(armyThemesForSystem).find(key => key.toLowerCase() === lowercasedArmy);
                        if (armyThemeKey) {
                            const baseTheme = THEMES[gameSystem] || DEFAULT_THEME;
                            const armyOverrides = armyThemesForSystem[armyThemeKey];
                            return { ...baseTheme, ...armyOverrides };
                        }
                    }
                }
            }
        }
    }
    if (filters.gameSystem !== 'all' && THEMES[filters.gameSystem]) {
        return THEMES[filters.gameSystem];
    }
    return DEFAULT_THEME;
};

// --- Custom Hook ---
// This custom hook combines the base store with selectors. Components will use this
// single hook to access all necessary state and actions, including derived data.
export const useAppStore = () => {
    const storeState = useStore(state => state);
    
    // Pass the state to selectors to get derived data.
    // In a more complex app with expensive selectors, you might use `useMemo` here
    // or Zustand's built-in memoization for selectors.
    const filteredMiniatures = selectFilteredMiniatures(storeState);
    const activeTheme = selectActiveTheme(storeState);
    
    return { ...storeState, filteredMiniatures, activeTheme };
};