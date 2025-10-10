
import React, { useState, useMemo, useCallback } from 'react';
import { Miniature, GameSystem, Status, Filter } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MiniatureForm from './components/MiniatureForm';
import MiniatureList from './components/MiniatureList';
import { PlusCircleIcon, UploadIcon, DownloadIcon } from './components/Icons';

const App: React.FC = () => {
    const [miniatures, setMiniatures] = useLocalStorage<Miniature[]>('miniatures', []);
    const [editingMiniature, setEditingMiniature] = useState<Miniature | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [filters, setFilters] = useState<Filter>({ gameSystem: 'all', army: '' });

    const addMiniature = (miniature: Omit<Miniature, 'id'>) => {
        const newMiniature: Miniature = { ...miniature, id: Date.now().toString() };
        setMiniatures([...miniatures, newMiniature]);
        setIsFormVisible(false);
    };

    const updateMiniature = (updatedMiniature: Miniature) => {
        setMiniatures(miniatures.map(m => m.id === updatedMiniature.id ? updatedMiniature : m));
        setEditingMiniature(null);
        setIsFormVisible(false);
    };

    const deleteMiniature = useCallback((id: string) => {
        if (window.confirm('Are you sure you want to delete this miniature entry?')) {
            setMiniatures(miniatures.filter(m => m.id !== id));
        }
    }, [miniatures, setMiniatures]);

    const handleEdit = useCallback((miniature: Miniature) => {
        setEditingMiniature(miniature);
        setIsFormVisible(true);
    }, []);

    const filteredMiniatures = useMemo(() => {
        return miniatures.filter(m => {
            const gameSystemMatch = filters.gameSystem === 'all' || m.gameSystem === filters.gameSystem;
            const armyMatch = filters.army === '' || m.army.toLowerCase().includes(filters.army.toLowerCase());
            return gameSystemMatch && armyMatch;
        });
    }, [miniatures, filters]);

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
        const dataStr = JSON.stringify(miniatures, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'miniatures_export.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const importedMiniatures = JSON.parse(text);
                    // Basic validation
                    if (Array.isArray(importedMiniatures)) {
                         setMiniatures(importedMiniatures);
                         alert('Data imported successfully!');
                    } else {
                        throw new Error('Invalid JSON format');
                    }
                }
            } catch (error) {
                alert('Failed to import data. Please check the file format.');
                console.error(error);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <Dashboard miniatures={filteredMiniatures} allMiniatures={miniatures} filters={filters} setFilters={setFilters} />
                
                <div className="my-8 p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <h2 className="text-3xl font-bold text-cyan-400 tracking-wider">My Collection</h2>
                        <div className="flex items-center gap-4">
                            <button onClick={handleAddNewClick} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                                <PlusCircleIcon />
                                Add New
                            </button>
                             <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                                <DownloadIcon />
                                Export JSON
                            </button>
                            <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                <UploadIcon />
                                Import JSON
                                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                            </label>
                        </div>
                    </div>

                    {isFormVisible && (
                        <MiniatureForm 
                            onSubmit={handleFormSubmit}
                            initialData={editingMiniature}
                            onCancel={() => {
                                setIsFormVisible(false);
                                setEditingMiniature(null);
                            }}
                        />
                    )}

                    <MiniatureList 
                        miniatures={filteredMiniatures} 
                        onEdit={handleEdit} 
                        onDelete={deleteMiniature} 
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
