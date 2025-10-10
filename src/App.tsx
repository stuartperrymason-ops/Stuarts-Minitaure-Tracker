import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { Miniature, GameSystem, Status, Filter } from './types';
import { useHistory } from './hooks/useHistory';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import DataManagementPage from './pages/DataManagementPage';
import { GAME_SYSTEMS, STATUSES } from './constants';
import { THEMES, DEFAULT_THEME, Theme, ARMY_THEMES } from './themes';


export type Page = 'dashboard' | 'collection' | 'data';

export type SortConfig = {
    key: keyof Miniature;
    direction: 'asc' | 'desc';
};

const App: React.FC = () => {
    const {
        state: miniatures,
        set: setMiniatures,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useHistory<Miniature[]>('miniatures', []);

    const [editingMiniature, setEditingMiniature] = useState<Miniature | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [filters, setFilters] = useState<Filter>({ gameSystem: 'all', army: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'modelName', direction: 'asc' });
    const [page, setPage] = useState<Page>('dashboard');

    const activeTheme: Theme = useMemo(() => {
        if (filters.army) {
            const lowercasedArmy = filters.army.toLowerCase().trim();
            if (lowercasedArmy) {
                for (const gameSystem in ARMY_THEMES) {
                    const gs = gameSystem as GameSystem;
                    const armyThemesForSystem = ARMY_THEMES[gs];
                    if (armyThemesForSystem) {
                        const armyThemeKey = Object.keys(armyThemesForSystem).find(
                            key => key.toLowerCase() === lowercasedArmy
                        );
                        if (armyThemeKey) {
                            const baseTheme = THEMES[gs] || DEFAULT_THEME;
                            const armyOverrides = armyThemesForSystem[armyThemeKey];
                            return { ...baseTheme, ...armyOverrides };
                        }
                    }
                }
            }
        }

        if (filters.gameSystem !== 'all' && THEMES[filters.gameSystem]) {
            return THEMES[filters.gameSystem];
        }

        return DEFAULT_THEME;
    }, [filters.gameSystem, filters.army]);

    const handleSort = useCallback((key: keyof Miniature) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key) {
                return { ...prevConfig, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    }, []);

    const addMiniature = (miniature: Omit<Miniature, 'id'>) => {
        const newMiniature: Miniature = { ...miniature, id: Date.now().toString() };
        setMiniatures(prev => [...prev, newMiniature]);
        setIsFormVisible(false);
    };

    const updateMiniature = (updatedMiniature: Miniature) => {
        setMiniatures(prev => prev.map(m => m.id === updatedMiniature.id ? updatedMiniature : m));
        setEditingMiniature(null);
        setIsFormVisible(false);
    };

    const deleteMiniature = useCallback((id: string) => {
        if (window.confirm('Are you sure you want to delete this miniature entry?')) {
            setMiniatures(prev => prev.filter(m => m.id !== id));
        }
    }, [setMiniatures]);

    const handleEdit = useCallback((miniature: Miniature) => {
        setEditingMiniature(miniature);
        setIsFormVisible(true);
    }, []);
    
    const handleCancelForm = useCallback(() => {
        setIsFormVisible(false);
        setEditingMiniature(null);
    }, []);

    const filteredMiniatures = useMemo(() => {
        let result = miniatures;

        result = result.filter(m => {
            const gameSystemMatch = filters.gameSystem === 'all' || m.gameSystem === filters.gameSystem;
            const armyMatch = filters.army === '' || m.army.toLowerCase().includes(filters.army.toLowerCase());
            return gameSystemMatch && armyMatch;
        });

        if (searchQuery.trim() !== '') {
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

    const handleExport = () => {
        if (miniatures.length === 0) {
            alert("Collection is empty. Nothing to export.");
            return;
        }

        const headers: (keyof Miniature)[] = ['id', 'modelName', 'gameSystem', 'army', 'status', 'modelCount'];
        
        const escapeCsvCell = (cell: string | number) => {
            const strCell = String(cell);
            if (strCell.includes(',') || strCell.includes('"') || strCell.includes('\n')) {
                return `"${strCell.replace(/"/g, '""')}"`;
            }
            return strCell;
        };

        const csvRows = [headers.join(',')];
        miniatures.forEach(mini => {
            const row = headers.map(header => escapeCsvCell(mini[header]));
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', 'miniatures_export.csv');
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error('Could not read file content.');
                
                const rows = text.split('\n').filter(row => row.trim() !== '');
                if (rows.length < 2) throw new Error("CSV file is empty or contains only a header.");

                const header = rows[0].trim().split(',').map(h => h.trim());
                
                const requiredHeaders = ['modelName', 'gameSystem', 'army', 'status', 'modelCount'];
                const missingHeaders = requiredHeaders.filter(h => !header.includes(h));
                if (missingHeaders.length > 0) {
                    throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
                }

                const headerMap: { [key: string]: number } = {};
                header.forEach((h, i) => { headerMap[h] = i; });

                const newMiniatures: Miniature[] = [];
                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    if (values.length !== header.length) {
                        console.warn(`Row ${i + 1} has an incorrect number of columns. Skipping.`);
                        continue;
                    }

                    const getValue = (key: string) => {
                        const index = headerMap[key];
                        if (index === undefined) return '';
                        let value = values[index] || '';
                        if (value.startsWith('"') && value.endsWith('"')) {
                            value = value.substring(1, value.length - 1).replace(/""/g, '"');
                        }
                        return value.trim();
                    };
                    
                    const gameSystem = getValue('gameSystem');
                    const status = getValue('status');
                    const modelCountStr = getValue('modelCount');
                    const modelName = getValue('modelName');

                    if (!Object.values(GameSystem).includes(gameSystem as GameSystem)) {
                        throw new Error(`Row ${i + 1}: Invalid game system "${gameSystem}"`);
                    }
                    if (!Object.values(Status).includes(status as Status)) {
                        throw new Error(`Row ${i + 1}: Invalid status "${status}"`);
                    }
                    const modelCount = parseInt(modelCountStr, 10);
                    if (isNaN(modelCount) || modelCount < 1) {
                        throw new Error(`Row ${i + 1}: Invalid model count "${modelCountStr}"`);
                    }
                    if (!modelName) {
                        throw new Error(`Row ${i + 1}: Model Name cannot be empty.`);
                    }

                    newMiniatures.push({
                        id: getValue('id') || `${Date.now()}-${i}`,
                        modelName,
                        gameSystem: gameSystem as GameSystem,
                        army: getValue('army'),
                        status: status as Status,
                        modelCount,
                    });
                }

                if (window.confirm(`Found ${newMiniatures.length} valid miniatures. This will overwrite your current collection. The previous collection will be available via the "Undo" button. Proceed?`)) {
                    setMiniatures(newMiniatures);
                    alert(`Successfully imported ${newMiniatures.length} miniatures.`);
                }

            } catch (error) {
                alert(`Failed to import CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
                console.error(error);
            } finally {
                event.target.value = '';
            }
        };
        reader.onerror = () => { alert('An error occurred while reading the file.'); event.target.value = ''; };
        reader.readAsText(file);
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
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onAddNewClick={handleAddNewClick}
                    onFormSubmit={handleFormSubmit}
                    onCancelForm={handleCancelForm}
                    onEdit={handleEdit}
                    onDelete={deleteMiniature}
                    onSort={handleSort}
                    onUndo={undo}
                    onRedo={redo}
                    theme={activeTheme}
                />;
            case 'data':
                return <DataManagementPage onImport={handleImport} onExport={handleExport} />;
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