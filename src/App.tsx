/**
 * @file src/App.tsx
 * This is the root component of the application. It orchestrates all other components and manages the global state.
 */

import React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Miniature, Filter } from './types';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import SettingsPage from './pages/SettingsPage';
import { THEMES, DEFAULT_THEME, Theme, ARMY_THEMES } from './themes';

// Defines the possible pages/routes in the application.
export type Page = 'dashboard' | 'collection' | 'settings';

// Defines the structure for sorting configuration, specifying which key to sort by and the direction.
export type SortConfig = {
    key: keyof Miniature;
    direction: 'asc' | 'desc';
};

/**
 * The main App component.
 * Manages all application state and renders the current page.
 * @returns {React.FC} The rendered App component.
 */
const App: React.FC = () => {
    // STATE MANAGEMENT
    // useState hooks are used to manage the component's state. When state changes, React re-renders the component.

    // Holds the array of all miniature objects.
    const [miniatures, setMiniatures] = useState<Miniature[]>([]);
    // Holds the array of all available game system names.
    const [gameSystems, setGameSystems] = useState<string[]>([]);
    // Holds the miniature object currently being edited, or null if none.
    const [editingMiniature, setEditingMiniature] = useState<Miniature | null>(null);
    // A boolean flag to control the visibility of the Add/Edit form.
    const [isFormVisible, setIsFormVisible] = useState(false);
    // Stores the current filter settings (game system and army).
    const [filters, setFilters] = useState<Filter>({ gameSystem: 'all', army: '' });
    // Stores the current text in the global search input.
    const [searchQuery, setSearchQuery] = useState('');
    // Stores the current sorting configuration.
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'modelName', direction: 'asc' });
    // Determines which page is currently being displayed.
    const [page, setPage] = useState<Page>('dashboard');

    // DATA FETCHING
    // useEffect is a hook that runs side effects in function components.
    // This effect runs once when the component mounts (due to the empty dependency array `[]`).
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both miniatures and game systems data from the backend API in parallel.
                const [miniaturesResponse, gameSystemsResponse] = await Promise.all([
                    fetch('/api/miniatures'),
                    fetch('/api/gamesystems')
                ]);

                if (!miniaturesResponse.ok) throw new Error('Network response for miniatures was not ok');
                const miniaturesData: Miniature[] = await miniaturesResponse.json();
                setMiniatures(miniaturesData);

                if (!gameSystemsResponse.ok) throw new Error('Network response for game systems was not ok');
                const gameSystemsData: string[] = await gameSystemsResponse.json();
                setGameSystems(gameSystemsData);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []); // Empty dependency array means this effect runs only once on mount.

    // THEME LOGIC
    // useMemo is a hook that memoizes the result of a function. It re-runs the function only if a dependency changes.
    // This is used for performance optimization, preventing expensive calculations on every render.
    const activeTheme: Theme = useMemo(() => {
        // Priority 1: Check for an exact, case-insensitive match for an army theme.
        if (filters.army) {
            const lowercasedArmy = filters.army.toLowerCase().trim();
            if (lowercasedArmy) {
                // If a specific game system is selected, look for an army theme ONLY within it. This is more predictable.
                if (filters.gameSystem !== 'all') {
                    const armyThemesForSystem = ARMY_THEMES[filters.gameSystem];
                    if (armyThemesForSystem) {
                        const armyThemeKey = Object.keys(armyThemesForSystem).find(
                            key => key.toLowerCase() === lowercasedArmy
                        );
                        if (armyThemeKey) {
                            // Found a theme. Base it on the selected game system's theme.
                            const baseTheme = THEMES[filters.gameSystem] || DEFAULT_THEME;
                            const armyOverrides = armyThemesForSystem[armyThemeKey];
                            return { ...baseTheme, ...armyOverrides };
                        }
                    }
                } 
                // If game system is 'all', search across all systems. This allows finding an army theme without selecting its system first.
                else {
                    for (const gameSystem in ARMY_THEMES) {
                        const gs = gameSystem;
                        const armyThemesForSystem = ARMY_THEMES[gs];
                        if (armyThemesForSystem) {
                            const armyThemeKey = Object.keys(armyThemesForSystem).find(
                                key => key.toLowerCase() === lowercasedArmy
                            );
                            if (armyThemeKey) {
                                // Found a matching army. Get its base theme and apply overrides.
                                const baseTheme = THEMES[gs] || DEFAULT_THEME;
                                const armyOverrides = armyThemesForSystem[armyThemeKey];
                                return { ...baseTheme, ...armyOverrides };
                            }
                        }
                    }
                }
            }
        }

        // Priority 2: Fall back to the game system theme if one is selected.
        if (filters.gameSystem !== 'all' && THEMES[filters.gameSystem]) {
            return THEMES[filters.gameSystem];
        }

        // Priority 3: Fall back to the default theme.
        return DEFAULT_THEME;
    }, [filters.gameSystem, filters.army]);
    
    // EVENT HANDLERS
    // useCallback is a hook that memoizes a function, preventing it from being recreated on every render.
    // This is useful for performance and when passing callbacks to child components.

    /**
     * Handles sorting logic for the miniature list. Toggles direction if the same column is clicked again.
     * @param {keyof Miniature} key - The key of the Miniature object to sort by.
     */
    const handleSort = useCallback((key: keyof Miniature) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig && prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    /**
     * Adds a new miniature to the database and updates the local state.
     * @param {Omit<Miniature, 'id'>} miniature - The new miniature data, without an ID.
     */
    const addMiniature = async (miniature: Omit<Miniature, 'id'>) => {
        // Optimistically create a temporary object, though the backend will provide the final one.
        const newMiniature: Miniature = { ...miniature, id: Date.now().toString() };
        try {
            // Send a POST request to the backend API.
            const response = await fetch('/api/miniatures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMiniature),
            });
            if (!response.ok) throw new Error('Failed to add miniature');
            const savedMiniature = await response.json();
            // Update the state with the miniature returned from the server (which includes the real ID).
            setMiniatures(prev => [...prev, savedMiniature]);
            setIsFormVisible(false);
        } catch (error) {
            console.error(error);
            alert('Error: Could not save miniature to the database.');
        }
    };

    /**
     * Updates an existing miniature in the database and updates the local state.
     * @param {Miniature} updatedMiniature - The miniature object with updated data.
     */
    const updateMiniature = async (updatedMiniature: Miniature) => {
        try {
            // Send a PUT request to the specific miniature's API endpoint.
            const response = await fetch(`/api/miniatures/${updatedMiniature.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMiniature),
            });
            if (!response.ok) throw new Error('Failed to update miniature');
            // Update the state by replacing the old miniature object with the new one.
            setMiniatures(prev => prev.map(m => (m.id === updatedMiniature.id ? updatedMiniature : m)));
            setEditingMiniature(null);
            setIsFormVisible(false);
        } catch (error) {
            console.error(error);
            alert('Error: Could not update miniature in the database.');
        }
    };

    /**
     * Deletes a miniature from the database and updates the local state.
     * @param {string} id - The ID of the miniature to delete.
     */
    const deleteMiniature = useCallback(async (id: string) => {
        if (window.confirm('Are you sure you want to delete this miniature entry? This action cannot be undone.')) {
            try {
                // Send a DELETE request to the API.
                const response = await fetch(`/api/miniatures/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete miniature');
                // Update the state by filtering out the deleted miniature.
                setMiniatures(prev => prev.filter(m => m.id !== id));
            } catch (error) {
                console.error(error);
                alert('Error: Could not delete miniature from the database.');
            }
        }
    }, []);

    /**
     * Sets the miniature to be edited and shows the form.
     * @param {Miniature} miniature - The miniature to edit.
     */
    const handleEdit = useCallback((miniature: Miniature) => {
        setEditingMiniature(miniature);
        setIsFormVisible(true);
    }, []);
    
    /**
     * Hides the form and clears the editing state.
     */
    const handleCancelForm = useCallback(() => {
        setIsFormVisible(false);
        setEditingMiniature(null);
    }, []);

    // DATA DERIVATION
    // useMemo is used again to calculate the list of filtered and sorted miniatures.
    // This calculation only re-runs if its dependencies (miniatures, filters, etc.) change.
    const filteredMiniatures = useMemo(() => {
        let result = [...miniatures];

        // Apply filters
        if (filters.gameSystem !== 'all') {
            result = result.filter(m => m.gameSystem === filters.gameSystem);
        }
        if (filters.army) {
            result = result.filter(m => m.army.toLowerCase().includes(filters.army.toLowerCase()));
        }

        // Apply search query: Case-insensitive search across multiple fields.
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
        if (sortConfig) {
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
        }

        return result;
    }, [miniatures, filters, searchQuery, sortConfig]);

    /**
     * Handles the form submission for both adding and updating miniatures.
     * @param {Omit<Miniature, 'id'> | Miniature} miniature - The miniature data from the form.
     */
    const handleFormSubmit = (miniature: Omit<Miniature, 'id'> | Miniature) => {
        if ('id' in miniature) {
            updateMiniature(miniature);
        } else {
            addMiniature(miniature);
        }
    };
    
    /**
     * Handles the click event for the "Add New" button.
     */
    const handleAddNewClick = () => {
        setEditingMiniature(null);
        setIsFormVisible(true);
    };

    /**
     * Adds a new game system to the database and updates local state.
     * @param {string} name - The name of the new game system.
     * @returns {Promise<boolean>} A promise that resolves to true on success, false on failure.
     */
    const addGameSystem = async (name: string): Promise<boolean> => {
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
            // Add the new system and re-sort the list.
            setGameSystems(prev => [...prev, newGameSystem.name].sort());
            return true;
        } catch (error) {
            console.error(error);
            alert('Error: Could not save game system to the database.');
            return false;
        }
    };

    // PAGE RENDERING LOGIC
    /**
     * Renders the current page based on the `page` state variable.
     * @returns {JSX.Element} The JSX for the current page.
     */
    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <DashboardPage 
                    filteredMiniatures={filteredMiniatures}
                    theme={activeTheme}
                />;
            case 'collection':
                return <CollectionPage
                    filteredMiniatures={filteredMiniatures}
                    allMiniatures={miniatures}
                    setMiniatures={setMiniatures}
                    allGameSystems={gameSystems}
                    filters={filters}
                    setFilters={setFilters}
                    isFormVisible={isFormVisible}
                    editingMiniature={editingMiniature}
                    sortConfig={sortConfig}
                    onAddNewClick={handleAddNewClick}
                    onFormSubmit={handleFormSubmit}
                    onCancelForm={handleCancelForm}
                    onEdit={handleEdit}
                    onDelete={deleteMiniature}
                    onSort={handleSort}
                    theme={activeTheme}
                />;
            case 'settings':
                return <SettingsPage
                    allGameSystems={gameSystems}
                    onAddGameSystem={addGameSystem}
                    theme={activeTheme}
                />;
            default:
                return <div>Page not found</div>;
        }
    };

    // RENDER OUTPUT
    // The JSX returned here defines the overall structure of the application.
    return (
        <div className={`min-h-screen text-gray-100 font-sans transition-colors duration-500 ${activeTheme.bgGradient}`}>
            <Header 
                page={page} 
                setPage={setPage} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                theme={activeTheme}
            />
            <main className="container mx-auto p-4 md:p-8">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;