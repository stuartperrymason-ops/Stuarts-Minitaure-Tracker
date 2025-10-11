import React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Miniature, Filter } from './types';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import { THEMES, DEFAULT_THEME, Theme, ARMY_THEMES } from './themes';
import { GameSystem } from './types';

export type Page = 'dashboard' | 'collection';

export type SortConfig = {
    key: keyof Miniature;
    direction: 'asc' | 'desc';
};

const App: React.FC = () => {
    const [miniatures, setMiniatures] = useState<Miniature[]>([]);
    const [editingMiniature, setEditingMiniature] = useState<Miniature | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [filters, setFilters] = useState<Filter>({ gameSystem: 'all', army: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'modelName', direction: 'asc' });
    const [page, setPage] = useState<Page>('dashboard');

    // Fetch initial data from the backend
    useEffect(() => {
        const fetchMiniatures = async () => {
            try {
                const response = await fetch('/api/miniatures');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Miniature[] = await response.json();
                setMiniatures(data);
            } catch (error) {
                console.error("Failed to fetch miniatures:", error);
                // Optionally, show an error message to the user
            }
        };
        fetchMiniatures();
    }, []);

    const activeTheme: Theme = useMemo(() => {
        const gameSystemKey = filters.gameSystem as GameSystem;
        if (filters.army) {
            const lowercasedArmy = filters.army.toLowerCase().trim();
            if (lowercasedArmy && ARMY_THEMES[gameSystemKey]) {
                const armyThemesForSystem = ARMY_THEMES[gameSystemKey];
                const armyThemeKey = Object.keys(armyThemesForSystem).find(key => key.toLowerCase() === lowercasedArmy);
                if (armyThemeKey) {
                    const baseTheme = THEMES[gameSystemKey] || DEFAULT_THEME;
                    const armyOverrides = armyThemesForSystem[armyThemeKey];
                    return { ...baseTheme, ...armyOverrides };
                }
            }
        }
        if (filters.gameSystem !== 'all' && THEMES[gameSystemKey]) {
            return THEMES[gameSystemKey];
        }
        return DEFAULT_THEME;
    }, [filters.gameSystem, filters.army]);
    
    const handleSort = useCallback((key: keyof Miniature) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig && prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    const addMiniature = async (miniature: Omit<Miniature, 'id'>) => {
        const newMiniature: Miniature = { ...miniature, id: Date.now().toString() };
        try {
            const response = await fetch('/api/miniatures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMiniature),
            });
            if (!response.ok) throw new Error('Failed to add miniature');
            const savedMiniature = await response.json();
            setMiniatures(prev => [...prev, savedMiniature]);
            setIsFormVisible(false);
        } catch (error) {
            console.error(error);
            alert('Error: Could not save miniature to the database.');
        }
    };

    const updateMiniature = async (updatedMiniature: Miniature) => {
        try {
            const response = await fetch(`/api/miniatures/${updatedMiniature.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMiniature),
            });
            if (!response.ok) throw new Error('Failed to update miniature');
            setMiniatures(prev => prev.map(m => (m.id === updatedMiniature.id ? updatedMiniature : m)));
            setEditingMiniature(null);
            setIsFormVisible(false);
        } catch (error) {
            console.error(error);
            alert('Error: Could not update miniature in the database.');
        }
    };

    const deleteMiniature = useCallback(async (id: string) => {
        if (window.confirm('Are you sure you want to delete this miniature entry? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/miniatures/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete miniature');
                setMiniatures(prev => prev.filter(m => m.id !== id));
            } catch (error) {
                console.error(error);
                alert('Error: Could not delete miniature from the database.');
            }
        }
    }, []);

    const handleEdit = useCallback((miniature: Miniature) => {
        setEditingMiniature(miniature);
        setIsFormVisible(true);
    }, []);
    
    const handleCancelForm = useCallback(() => {
        setIsFormVisible(false);
        setEditingMiniature(null);
    }, []);

    const filteredMiniatures = useMemo(() => {
        let result = [...miniatures];

        if (filters.gameSystem !== 'all') {
            result = result.filter(m => m.gameSystem === filters.gameSystem);
        }
        if (filters.army) {
            result = result.filter(m => m.army.toLowerCase().includes(filters.army.toLowerCase()));
        }

        if (searchQuery.trim()) {
            const lowercasedQuery = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.modelName.toLowerCase().includes(lowercasedQuery) ||
                m.gameSystem.toLowerCase().includes(lowercasedQuery) ||
                m.army.toLowerCase().includes(lowercasedQuery)
            );
        }

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

    const handleFormSubmit = (miniature: Omit<Miniature, 'id'> | Miniature) => {
        if ('id' in miniature) {
            updateMiniature(miniature);
        } else {
            addMiniature(miniature);
        }
    };
    
    const handleAddNewClick = () => {
        setEditingMiniature(null);
        setIsFormVisible(true);
    };

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
            default:
                return <div>Page not found</div>;
        }
    };

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