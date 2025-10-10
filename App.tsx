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
        canRedo
    } = useHistory<Miniature[]>('miniatures', []);

    const [editingMiniature, setEditingMiniature] = useState<Miniature | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [filters, setFilters] = useState<Filter>({ gameSystem: 'all', army: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'modelName', direction: 'asc' });
    const [page, setPage] = useState<Page>('dashboard');

    const activeTheme: Theme = useMemo(() => {
        // Prioritize the army filter for theming
        if (filters.army) {
            const lowercasedArmy = filters.army.toLowerCase().trim();
            if (lowercasedArmy) {
                // Search through all game systems for a matching army theme
                for (const gameSystem in ARMY_THEMES) {
                    const gs = gameSystem as GameSystem;
                    const armyThemesForSystem = ARMY_THEMES[gs];
                    if (armyThemesForSystem) {
                        const armyThemeKey = Object.keys(armyThemesForSystem).find(
                            key => key.toLowerCase() === lowercasedArmy
                        );
                        if (armyThemeKey) {
                            // Found a theme for the army.
                            // Use its game system's theme as a base and merge the army-specific overrides.
                            const baseTheme = THEMES[gs] || DEFAULT_THEME;
                            const armyOverrides = armyThemesForSystem[armyThemeKey];
                            return { ...baseTheme, ...armyOverrides };
                        }
                    }
                }
            }
        }

        // If no army theme is found, fall back to the game system theme
        if (filters.gameSystem !== 'all' && THEMES[filters.gameSystem]) {
            return THEMES[filters.gameSystem];
        }

        // Otherwise, use the default theme
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

    const escapeCsvCell = (cell: any): string => {
        const strCell = String(cell);
        if (strCell.includes(',') || strCell.includes('"') || strCell.includes('\n')) {
            return `"${strCell.replace(/"/g, '""')}"`;
        }
        return strCell;
    };

    const handleExport = () => {
        const headers: (keyof Miniature)[] = ['id', 'modelName', 'gameSystem', 'army', 'status', 'modelCount'];
        const csvRows = [
            headers.join(','),
            ...miniatures.map(mini => 
                headers.map(header => escapeCsvCell(mini[header])).join(',')
            )
        ];
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
                
                const lines = text.trim().split('\n');
                const headerLine = lines.shift();
                if (!headerLine) throw new Error('CSV file is empty or missing a header row.');
                const headers = headerLine.split(',').map(h => h.trim());

                const validMiniatures: Miniature[] = [];
                const errors: string[] = [];

                lines.forEach((line, index) => {
                    if (!line.trim()) return;
                    
                    const values = line.split(',');
                    const item: any = headers.reduce((obj, header, i) => {
                        obj[header] = values[i] ? values[i].trim() : '';
                        return obj;
                    }, {} as any);

                    const { gameSystem, status, modelName, army } = item;
                    const modelCount = parseInt(item.modelCount, 10);
                    
                    const isGameSystemValid = gameSystem && GAME_SYSTEMS.includes(gameSystem as GameSystem);
                    const isStatusValid = status && STATUSES.includes(status as Status);
                    
                    if (modelName && isGameSystemValid && army && isStatusValid && !isNaN(modelCount) && modelCount > 0) {
                        validMiniatures.push({
                            id: item.id || `${Date.now()}-${index}`,
                            modelName, gameSystem, army, status, modelCount,
                        });
                    } else {
                        let errorReason = 'is malformed.';
                         if (!isGameSystemValid) errorReason = `has invalid Game System: "${gameSystem}".`;
                         else if (!isStatusValid) errorReason = `has invalid Status: "${status}".`;
                         else if (!modelName) errorReason = 'is missing a "modelName".';
                         else if (!army) errorReason = 'is missing an "army".';
                         else if (isNaN(modelCount) || modelCount <= 0) errorReason = `has invalid "modelCount": "${item.modelCount}".`;
                        errors.push(`Row #${index + 2} ${errorReason}`);
                    }
                });

                if (validMiniatures.length === 0) {
                    alert(`Import failed. No valid entries found.\n\n${errors.length > 0 ? 'Errors:\n' + errors.join('\n') : ''}`);
                    return;
                }

                if (window.confirm(`This will overwrite your collection with ${validMiniatures.length} miniature(s). Proceed?`)) {
                    setMiniatures(validMiniatures);
                    let successMessage = `Successfully imported ${validMiniatures.length} miniatures.`;
                    if (errors.length > 0) {
                        successMessage += `\n\n${errors.length} rows were skipped. Check console for details.`;
                        console.error("Import errors:", errors);
                    }
                    alert(successMessage);
                }

            } catch (error) {
                alert(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            />
            <main className="container mx-auto p-4 md:p-8">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;