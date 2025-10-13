import React, { useState, useRef } from 'react';
import { Miniature, Filter, Status, GameSystem } from '../types';
import { SortConfig } from '../App';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import { PlusCircleIcon, UploadIcon, DownloadIcon } from '../components/Icons';
import { Theme } from '../themes';
import BulkActionBar from '../components/BulkActionBar';
import BulkEditModal from '../components/BulkEditModal';
import { STATUSES } from '../constants';

interface CollectionPageProps {
    filteredMiniatures: Miniature[];
    allMiniatures: Miniature[];
    setMiniatures: React.Dispatch<React.SetStateAction<Miniature[]>>;
    allGameSystems: string[];
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    isFormVisible: boolean;
    editingMiniature: Miniature | null;
    sortConfig: SortConfig;
    onAddNewClick: () => void;
    onFormSubmit: (miniature: Omit<Miniature, 'id'> | Miniature) => void;
    onCancelForm: () => void;
    onEdit: (miniature: Miniature) => void;
    onDelete: (id: string) => void;
    onSort: (key: keyof Miniature) => void;
    theme: Theme;
}

const CollectionPage: React.FC<CollectionPageProps> = (props) => {
    const {
        filteredMiniatures, allMiniatures, setMiniatures, allGameSystems, filters, setFilters, isFormVisible, editingMiniature,
        sortConfig, onAddNewClick, onFormSubmit, onCancelForm, onEdit,
        onDelete, onSort, theme
    } = props;

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
    const importInputRef = useRef<HTMLInputElement>(null);

    const handleSelect = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = (filteredIds: string[]) => {
        const currentFilteredIds = new Set(filteredIds);
        const selectedFilteredIds = new Set(
            Array.from(selectedIds).filter(id => currentFilteredIds.has(id))
        );

        if (selectedFilteredIds.size === currentFilteredIds.size && currentFilteredIds.size > 0) {
            setSelectedIds(prev => {
                const newSet = new Set(prev);
                for (const id of currentFilteredIds) { newSet.delete(id); }
                return newSet;
            });
        } else {
            setSelectedIds(prev => new Set([...Array.from(prev), ...filteredIds]));
        }
    };
    
    const clearSelection = () => setSelectedIds(new Set());

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected miniatures? This action cannot be undone.`)) {
            const idsToDelete = Array.from(selectedIds);
            const originalMiniatures = [...allMiniatures];
            setMiniatures(prev => prev.filter(m => !idsToDelete.includes(m.id)));
            clearSelection();
            
            try {
                const response = await fetch('/api/miniatures/bulk', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: idsToDelete }),
                });
                if (!response.ok) throw new Error('Bulk delete failed on the server.');
            } catch (error) {
                console.error(error);
                alert('Error: Could not bulk delete miniatures. Reverting changes.');
                setMiniatures(originalMiniatures);
            }
        }
    };

    const handleBulkEdit = async (updates: { status?: Status; army?: string; gameSystem?: GameSystem; notes?: string }) => {
        const idsToUpdate = Array.from(selectedIds);
        const originalMiniatures = [...allMiniatures];
        
        setMiniatures(prev =>
            prev.map(m => (idsToUpdate.includes(m.id) ? { ...m, ...updates } : m))
        );
        setIsBulkEditModalOpen(false);
        clearSelection();

        try {
            const response = await fetch('/api/miniatures/bulk', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: idsToUpdate, updates }),
            });
            if (!response.ok) throw new Error('Bulk update failed on the server.');
            
            const updatedMiniatures: Miniature[] = await response.json();
            const updatedMap = new Map(updatedMiniatures.map(m => [m.id, m]));
            
            setMiniatures(prev => prev.map(m => updatedMap.get(m.id) ?? m));
        } catch (error) {
            console.error(error);
            alert('Error: Could not bulk update miniatures. Reverting changes.');
            setMiniatures(originalMiniatures);
        }
    };

    const handleExportCSV = () => {
        const headers = ['modelName', 'gameSystem', 'army', 'status', 'modelCount', 'notes'];
        const csvContent = [
            headers.join(','),
            ...allMiniatures.map(m => headers.map(header => {
                const value = m[header as keyof Miniature] ?? '';
                const escapedValue = `"${String(value).replace(/"/g, '""')}"`;
                return escapedValue;
            }).join(','))
        ].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'miniatures_collection.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleImportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.trim().replace(/\r/g, '').split('\n');
                const headerLine = lines.shift();
                if (!headerLine) throw new Error("CSV is empty or has no header.");

                const headers = headerLine.trim().split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                const requiredHeaders = ['modelName', 'gameSystem', 'army', 'status', 'modelCount'];
                if (!requiredHeaders.every(h => headers.includes(h))) {
                    throw new Error(`CSV must contain headers: ${requiredHeaders.join(', ')}`);
                }
    
                const miniaturesToImport: Omit<Miniature, 'id'>[] = [];
                let skippedCount = 0;
    
                for (const line of lines) {
                    if (!line.trim()) continue;
                    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                    const row = headers.reduce((obj, header, index) => {
                        obj[header] = values[index];
                        return obj;
                    }, {} as Record<string, string>);
    
                    const modelCount = parseInt(row.modelCount, 10);
                    const isValid = row.modelName && allGameSystems.includes(row.gameSystem as GameSystem) && row.army && STATUSES.includes(row.status as Status) && !isNaN(modelCount) && modelCount > 0;
    
                    if (isValid) {
                        const miniData: Omit<Miniature, 'id'> = {
                            modelName: row.modelName,
                            gameSystem: row.gameSystem as GameSystem,
                            army: row.army,
                            status: row.status as Status,
                            modelCount: modelCount
                        };
                        if (headers.includes('notes')) {
                            miniData.notes = row.notes || '';
                        }
                        miniaturesToImport.push(miniData);
                    } else {
                        skippedCount++;
                    }
                }
    
                if (miniaturesToImport.length > 0) {
                    if (!window.confirm(`Found ${miniaturesToImport.length} valid miniatures to import. Proceed?`)) return;
    
                    const response = await fetch('/api/miniatures/bulk-import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(miniaturesToImport),
                    });
                    if (!response.ok) throw new Error('Failed to import miniatures to the database.');
    
                    const newMiniatures = await response.json();
                    setMiniatures(prev => [...prev, ...newMiniatures]);
                    alert(`Successfully imported ${newMiniatures.length} miniatures.${skippedCount > 0 ? ` Skipped ${skippedCount} invalid rows.` : ''}`);
                } else {
                    alert(`No valid miniatures found to import.${skippedCount > 0 ? ` Skipped ${skippedCount} invalid rows.` : ''}`);
                }
            } catch (error) {
                alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                if(importInputRef.current) importInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <FilterControls 
                filters={filters} 
                setFilters={setFilters} 
                allMiniatures={allMiniatures}
                allGameSystems={allGameSystems}
                theme={theme}
            />
        
            <div className="my-8 p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className={`text-3xl font-bold ${theme.primaryText} tracking-wider transition-colors duration-300`}>My Collection</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300">
                            <DownloadIcon /> Export to CSV
                        </button>
                        <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300 cursor-pointer">
                            <UploadIcon /> Import from CSV
                            <input type="file" accept=".csv" className="hidden" onChange={handleImportChange} ref={importInputRef} />
                        </label>
                        <button onClick={onAddNewClick} className={`flex items-center gap-2 px-4 py-2 ${theme.button} rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}>
                            <PlusCircleIcon /> Add New
                        </button>
                    </div>
                </div>

                {selectedIds.size > 0 && (
                    <BulkActionBar
                        selectedCount={selectedIds.size}
                        onClear={clearSelection}
                        onDelete={handleBulkDelete}
                        onEdit={() => setIsBulkEditModalOpen(true)}
                        theme={theme}
                    />
                )}

                {isBulkEditModalOpen && (
                    <BulkEditModal
                        selectedCount={selectedIds.size}
                        onClose={() => setIsBulkEditModalOpen(false)}
                        onSave={handleBulkEdit}
                        theme={theme}
                        allGameSystems={allGameSystems}
                    />
                )}

                {isFormVisible && (
                    <MiniatureForm 
                        onSubmit={onFormSubmit}
                        initialData={editingMiniature}
                        onCancel={onCancelForm}
                        theme={theme}
                        allGameSystems={allGameSystems}
                    />
                )}

                <MiniatureList 
                    miniatures={filteredMiniatures} 
                    onEdit={onEdit} 
                    onDelete={onDelete}
                    onSort={onSort}
                    sortConfig={sortConfig}
                    selectedIds={selectedIds}
                    onSelect={handleSelect}
                    onSelectAll={() => handleSelectAll(filteredMiniatures.map(m => m.id))}
                />
            </div>
        </>
    );
};

export default CollectionPage;