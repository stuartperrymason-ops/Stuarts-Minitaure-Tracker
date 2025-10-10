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
        try {
            const headers = ['id', 'modelName', 'gameSystem', 'army', 'status', 'modelCount'];
            
            const sanitizeValue = (value: any): string => {
                const str = String(value);
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };
    
            const csvRows = [headers.join(',')];
    
            miniatures.forEach(mini => {
                const row = headers.map(header => sanitizeValue(mini[header as keyof Miniature]));
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
        } catch (error) {
            alert('An error occurred while preparing the data for saving.');
            console.error(error);
        }
    };
    
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error('Could not read file content.');
                
                const lines = text.trim().split(/\r?\n/);
                if (lines.length < 2) throw new Error('CSV file must have a header and at least one data row.');
    
                const parseCsvRow = (row: string): string[] => {
                    const result: string[] = [];
                    let current = '';
                    let inQuote = false;
                    for (let i = 0; i < row.length; i++) {
                        const char = row[i];
                        if (char === '"' && inQuote && row[i+1] === '"') {
                            current += '"';
                            i++;
                        } else if (char === '"') {
                            inQuote = !inQuote;
                        } else if (char === ',' && !inQuote) {
                            result.push(current);
                            current = '';
                        } else {
                            current += char;
                        }
                    }
                    result.push(current);
                    return result;
                };
    
                const headers = parseCsvRow(lines[0]).map(h => h.trim());
                const expectedHeaders = ['id', 'modelName', 'gameSystem', 'army', 'status', 'modelCount'];
                
                if (headers.length !== expectedHeaders.length || !expectedHeaders.every((h, i) => headers[i] === h)) {
                    throw new Error(`Invalid CSV headers. Expected: ${expectedHeaders.join(',')}`);
                }
    
                const importedMiniatures: Miniature[] = [];
    
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
    
                    const values = parseCsvRow(lines[i]);
                    if (values.length !== headers.length) {
                        console.warn(`Skipping malformed row ${i + 1}: Expected ${headers.length} columns, found ${values.length}`);
                        continue;
                    }
                    
                    const miniObject: any = {};
                    headers.forEach((header, index) => {
                        miniObject[header] = values[index];
                    });
    
                    if (!miniObject.modelName || !miniObject.gameSystem || !miniObject.army || !miniObject.status) {
                         throw new Error(`Row ${i + 1} is missing required fields.`);
                    }
                    const modelCount = parseInt(miniObject.modelCount, 10);
                    if (isNaN(modelCount) || modelCount < 1) {
                        throw new Error(`Row ${i + 1} has an invalid modelCount.`);
                    }
                    if (!STATUSES.includes(miniObject.status as Status)) {
                        throw new Error(`Row ${i + 1} has an invalid status: "${miniObject.status}".`);
                    }
                    if (!GAME_SYSTEMS.includes(miniObject.gameSystem as GameSystem)) {
                        throw new Error(`Row ${i + 1} has an invalid gameSystem: "${miniObject.gameSystem}".`);
                    }
    
                    importedMiniatures.push({
                        id: miniObject.id || Date.now().toString() + i,
                        modelName: miniObject.modelName,
                        gameSystem: miniObject.gameSystem as GameSystem,
                        army: miniObject.army,
                        status: miniObject.status as Status,
                        modelCount: modelCount,
                    });
                }
    
                if (window.confirm(`This will overwrite your current collection with ${importedMiniatures.length} miniature(s) from the file. This action can be undone. Proceed?`)) {
                    setMiniatures(importedMiniatures);
                    alert(`Successfully imported ${importedMiniatures.length} miniature(s).`);
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