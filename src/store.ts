import { create } from 'zustand';
import { produce } from 'immer';
import { Miniature, Filter, SortConfig, Status } from './types';
import { Theme, THEMES, ARMY_THEMES, DEFAULT_THEME } from './themes';
import axios from 'axios';

// Define the shape of the application's state.
interface AppState {
    // Core Data
    miniatures: Miniature[];
    gameSystems: string[];

    // UI State
    page: 'dashboard' | 'collection' | 'data';
    filters: Filter;
    searchQuery: string;
    sortConfig: SortConfig;
    isFormVisible: boolean;
    editingMiniature: Miniature | null;
    selectedIds: string[];
    isBulkEditing: boolean;
    isGalleryOpen: boolean;
    galleryMiniature: Miniature | null;
    isLoading: boolean;
    error: string | null;
    
    // Derived State (getters)
    activeTheme: Theme;
    filteredMiniatures: Miniature[];
    isAllSelected: boolean;

    // Actions (functions to modify state)
    setPage: (page: 'dashboard' | 'collection' | 'data') => void;
    fetchInitialData: () => Promise<void>;
    addGameSystem: (name: string) => Promise<boolean>;
    setFilters: (newFilters: Partial<Filter>) => void;
    setSearchQuery: (query: string) => void;
    setSortConfig: (key: keyof Miniature) => void;
    addMiniature: (miniature: Omit<Miniature, '_id'>) => Promise<void>;
    updateMiniature: (miniature: Miniature) => Promise<void>;
    deleteMiniature: (id: string) => Promise<void>;
    importData: (miniatures: Omit<Miniature, '_id'>[]) => Promise<void>;
    startEditing: (miniature: Miniature) => void;
    startAdding: () => void;
    stopEditing: () => void;
    toggleSelection: (id: string) => void;
    toggleSelectAll: () => void;
    clearSelection: () => void;
    startBulkEditing: () => void;
    stopBulkEditing: () => void;
    deleteSelected: () => Promise<void>;
    updateSelected: (updates: Partial<Pick<Miniature, 'status' | 'army' | 'gameSystem' | 'notes'>>) => Promise<void>;
    openImageGallery: (miniature: Miniature) => void;
    closeImageGallery: () => void;
}

// Create the Zustand store.
export const useAppStore = create<AppState>((set, get) => ({
    // --- STATE ---
    miniatures: [],
    gameSystems: [],
    page: 'dashboard',
    filters: { gameSystem: 'all', army: '' },
    searchQuery: '',
    sortConfig: { key: 'modelName', direction: 'asc' },
    isFormVisible: false,
    editingMiniature: null,
    selectedIds: [],
    isBulkEditing: false,
    isGalleryOpen: false,
    galleryMiniature: null,
    isLoading: true,
    error: null,

    // --- DERIVED STATE ---
    get activeTheme() {
        const { filters, gameSystems } = get();
        if (filters.army) {
            const lowercasedArmy = filters.army.toLowerCase().trim();
            if (lowercasedArmy) {
                for (const gameSystem in ARMY_THEMES) {
                    if (gameSystems.includes(gameSystem)) {
                        const armyThemesForSystem = ARMY_THEMES[gameSystem];
                        if (armyThemesForSystem) {
                            const armyThemeKey = Object.keys(armyThemesForSystem).find(
                                key => key.toLowerCase() === lowercasedArmy
                            );
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
    },

    get filteredMiniatures() {
        const { miniatures, filters, searchQuery, sortConfig } = get();
        let result = [...miniatures];

        // Apply filters
        result = result.filter(m => {
            const gameSystemMatch = filters.gameSystem === 'all' || m.gameSystem === filters.gameSystem;
            const armyMatch = filters.army === '' || m.army.toLowerCase().includes(filters.army.toLowerCase());
            return gameSystemMatch && armyMatch;
        });

        // Apply search
        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.modelName.toLowerCase().includes(lowercasedQuery) ||
                m.gameSystem.toLowerCase().includes(lowercasedQuery) ||
                m.army.toLowerCase().includes(lowercasedQuery) ||
                m.notes?.toLowerCase().includes(lowercasedQuery)
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
            } else if (aValue === undefined || aValue === null) {
                return 1;
            } else if (bValue === undefined || bValue === null) {
                return -1;
            }
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
        
        return result;
    },

    get isAllSelected() {
        const { filteredMiniatures, selectedIds } = get();
        const filteredIds = new Set(filteredMiniatures.map(m => m._id));
        return filteredMiniatures.length > 0 && selectedIds.length > 0 && selectedIds.every(id => filteredIds.has(id));
    },

    // --- ACTIONS ---
    setPage: (page) => set({ page }),

    fetchInitialData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [miniaturesRes, gameSystemsRes] = await Promise.all([
                axios.get('/api/miniatures'),
                axios.get('/api/gamesystems')
            ]);
            set({
                miniatures: miniaturesRes.data,
                gameSystems: gameSystemsRes.data.map((gs: any) => gs.name).sort(),
                isLoading: false,
            });
        } catch (error) {
            let errorMessage = 'An unexpected error occurred while fetching data.';
            if (axios.isAxiosError(error)) {
                 errorMessage = error.response?.data?.message || 'Failed to connect to the server. Please ensure it is running and properly configured.';
            }
            set({ isLoading: false, error: errorMessage });
        }
    },

    addGameSystem: async (name) => {
        if (get().gameSystems.some(gs => gs.toLowerCase() === name.toLowerCase())) {
            alert('This game system already exists.');
            return false;
        }
        try {
            const response = await axios.post('/api/gamesystems', { name });
            set(produce((draft: AppState) => {
                draft.gameSystems.push(response.data.name);
                draft.gameSystems.sort();
            }));
            return true;
        } catch (error) {
            console.error('Failed to add game system:', error);
            alert('Error adding game system. See console for details.');
            return false;
        }
    },

    setFilters: (newFilters) => set(produce((draft: AppState) => {
        draft.filters = { ...draft.filters, ...newFilters };
        draft.selectedIds = [];
    })),
    
    setSearchQuery: (query) => set({ searchQuery: query }),

    setSortConfig: (key) => set(state => ({
        sortConfig: state.sortConfig.key === key && state.sortConfig.direction === 'asc'
            ? { key, direction: 'desc' }
            : { key, direction: 'asc' }
    })),

    addMiniature: async (miniatureData) => {
        try {
            const response = await axios.post('/api/miniatures', miniatureData);
            set(produce((draft: AppState) => {
                draft.miniatures.push(response.data);
                draft.isFormVisible = false;
                draft.editingMiniature = null;
            }));
        } catch (error) {
            console.error("Failed to add miniature:", error);
            alert("Error: Could not add miniature.");
        }
    },

    updateMiniature: async (miniature) => {
        try {
            const response = await axios.put(`/api/miniatures/${miniature._id}`, miniature);
            set(produce((draft: AppState) => {
                const index = draft.miniatures.findIndex(m => m._id === miniature._id);
                if (index !== -1) draft.miniatures[index] = response.data;
                draft.isFormVisible = false;
                draft.editingMiniature = null;
            }));
        } catch (error) {
            console.error("Failed to update miniature:", error);
            alert("Error: Could not update miniature.");
        }
    },

    deleteMiniature: async (id) => {
        try {
            await axios.delete(`/api/miniatures/${id}`);
            set(produce((draft: AppState) => {
                draft.miniatures = draft.miniatures.filter(m => m._id !== id);
            }));
        } catch (error) {
            console.error("Failed to delete miniature:", error);
            alert("Error: Could not delete miniature.");
        }
    },

    importData: async (miniaturesToImport) => {
        try {
            await axios.post('/api/miniatures/bulk-replace', { miniatures: miniaturesToImport });
            await get().fetchInitialData();
        } catch (error) {
            console.error("Failed to import data:", error);
            alert("Error: Could not import data.");
        }
    },

    startEditing: (miniature) => set({ editingMiniature: miniature, isFormVisible: true }),
    startAdding: () => set({ editingMiniature: null, isFormVisible: true }),
    stopEditing: () => set({ editingMiniature: null, isFormVisible: false }),

    toggleSelection: (id) => set(produce((draft: AppState) => {
        const index = draft.selectedIds.indexOf(id);
        if (index > -1) {
            draft.selectedIds.splice(index, 1);
        } else {
            draft.selectedIds.push(id);
        }
    })),

    toggleSelectAll: () => {
        const { isAllSelected, filteredMiniatures } = get();
        if (isAllSelected) {
            set({ selectedIds: [] });
        } else {
            set({ selectedIds: filteredMiniatures.map(m => m._id) });
        }
    },

    clearSelection: () => set({ selectedIds: [] }),
    startBulkEditing: () => set({ isBulkEditing: true }),
    stopBulkEditing: () => set({ isBulkEditing: false }),

    deleteSelected: async () => {
        const { selectedIds } = get();
        try {
            await axios.post('/api/miniatures/bulk-delete', { ids: selectedIds });
            set(produce((draft: AppState) => {
                draft.miniatures = draft.miniatures.filter(m => !selectedIds.includes(m._id));
                draft.selectedIds = [];
            }));
        } catch (error) {
            console.error("Failed to delete selected miniatures:", error);
            alert("Error: Could not delete selected miniatures.");
        }
    },
    
    updateSelected: async (updates) => {
        const { selectedIds } = get();
        try {
            const response = await axios.post('/api/miniatures/bulk-update', { ids: selectedIds, updates });
            // FIX: Use a type guard to ensure the compiler understands that the filtered array contains valid Miniature objects. This resolves a downstream type error.
            const validUpdatedMinis = Array.isArray(response.data)
                ? response.data.filter((m: any): m is Miniature => m && m._id && m.modelName)
                : [];
            const updatedMinisMap = new Map(validUpdatedMinis.map((m: Miniature) => [m._id, m]));
            set(produce((draft: AppState) => {
                draft.miniatures.forEach((mini, index) => {
                    if (updatedMinisMap.has(mini._id)) {
                        draft.miniatures[index] = updatedMinisMap.get(mini._id)!;
                    }
                });
                draft.selectedIds = [];
                draft.isBulkEditing = false;
            }));
        } catch (error) {
            console.error("Failed to update selected miniatures:", error);
            alert("Error: Could not update selected miniatures.");
        }
    },
    
    openImageGallery: (miniature) => set({ isGalleryOpen: true, galleryMiniature: miniature }),
    closeImageGallery: () => set({ isGalleryOpen: false, galleryMiniature: null }),
}));