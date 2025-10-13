/**
 * @file src/pages/CollectionPage.tsx
 * This component serves as the main view for the user's collection.
 * It orchestrates the filter controls, the add/edit form, the miniature list, and bulk action features.
 * With Zustand, it now manages its own state and actions by connecting to the central store.
 */

import React, { useState, useRef } from 'react';
import { Miniature, Status } from '../types';
import { useAppStore } from '../store';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import { PlusCircleIcon, UploadIcon, DownloadIcon } from '../components/Icons';
import BulkActionBar from '../components/BulkActionBar';
import BulkEditModal from '../components/BulkEditModal';
import { STATUSES } from '../constants';
import GameLogoDisplay from '../components/GameLogoDisplay';

/**
 * The page component for the collection view.
 * Manages UI state specific to this page, like selections and modal visibility,
 * while pulling global state and actions from the Zustand store.
 * @returns {JSX.Element} The rendered collection page.
 */
const CollectionPage: React.FC = () => {
    // Select all necessary state and actions from the central store.
    const {
        filteredMiniatures,
        miniatures: allMiniatures,
        gameSystems: allGameSystems,
        filters,
        isFormVisible,
        editingMiniature,
        sortConfig,
        activeTheme,
        setFilters,
        showFormForAddNew,
        showFormForEdit,
        hideForm,
        addMiniature,
        updateMiniature,
        deleteMiniature,
        handleSort,
        bulkDelete,
        bulkUpdate,
        bulkImport
    } = useAppStore();

    // State for managing the set of selected miniature IDs for bulk actions. This state is local to the page.
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    // State to control the visibility of the bulk edit modal.
    const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
    // A ref to the file input element for CSV import, used to reset it after an import.
    const importInputRef = useRef<HTMLInputElement>(null);

    const handleFormSubmit = (miniature: Omit<Miniature, 'id'> | Miniature) => {
        if ('id' in miniature) {
            updateMiniature(miniature);
        } else {
            addMiniature(miniature);
        }
    };

    const handleSelect = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = (filteredIds: string[]) => {
        const currentFilteredIds = new Set(filteredIds);
        const selectedFilteredIds = new Set(Array.from(selectedIds).filter(id => currentFilteredIds.has(id)));
        if (selectedFilteredIds.size === currentFilteredIds.size && currentFilteredIds.size > 0) {
            setSelectedIds(prev => {
                const newSet = new Set(prev);
                currentFilteredIds.forEach(id => newSet.delete(id));
                return newSet;
            });
        } else {
            setSelectedIds(prev => new Set([...Array.from(prev), ...filteredIds]));
        }
    };
    
    const clearSelection = () => setSelectedIds(new Set());

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected miniatures? This action cannot be undone.`)) {
            bulkDelete(Array.from(selectedIds));
            clearSelection();
        }
    };

    const handleBulkEdit = (updates: { status?: Status; army?: string; gameSystem?: string; notes?: string }) => {
        bulkUpdate(Array.from(selectedIds), updates);
        setIsBulkEditModalOpen(false);
        clearSelection();
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
    
                const parsedMiniatures: Omit<Miniature, 'id'>[] = [];
                let skippedCount = 0;
    
                for (const line of lines) {
                    if (!line.trim()) continue;
                    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                    const row = headers.reduce((obj, header, index) => ({...obj, [header]: values[index]}), {} as Record<string, string>);
                    const modelCount = parseInt(row.modelCount, 10);
                    const isValid = row.modelName && allGameSystems.includes(row.gameSystem) && row.army && STATUSES.includes(row.status as Status) && !isNaN(modelCount) && modelCount > 0;
    
                    if (isValid) {
                        parsedMiniatures.push({
                            modelName: row.modelName,
                            gameSystem: row.gameSystem,
                            army: row.army,
                            status: row.status as Status,
                            modelCount: modelCount,
                            ...(headers.includes('notes') && { notes: row.notes || '' })
                        });
                    } else {
                        skippedCount++;
                    }
                }
    
                if (parsedMiniatures.length > 0) {
                    const existingKeys = new Set(allMiniatures.map(m => `${m.modelName.toLowerCase()}|${m.gameSystem.toLowerCase()}|${m.army.toLowerCase()}`));
                    const newMinis = parsedMiniatures.filter(mini => !existingKeys.has(`${mini.modelName.toLowerCase()}|${mini.gameSystem.toLowerCase()}|${mini.army.toLowerCase()}`));
                    const duplicateMinis = parsedMiniatures.filter(mini => existingKeys.has(`${mini.modelName.toLowerCase()}|${mini.gameSystem.toLowerCase()}|${mini.army.toLowerCase()}`));

                    let finalMiniaturesToImport = newMinis;
                    if (duplicateMinis.length > 0) {
                        if (!window.confirm(`Found ${duplicateMinis.length} potential duplicates. Do you want to skip them and import only the ${newMinis.length} new miniatures? Click 'Cancel' to import everything.`)) {
                            finalMiniaturesToImport = parsedMiniatures;
                        }
                    }

                    if (finalMiniaturesToImport.length > 0) {
                        if (!window.confirm(`Proceed with importing ${finalMiniaturesToImport.length} miniatures?`)) return;
                        await bulkImport(finalMiniaturesToImport);
                    } else {
                        alert(`No new miniatures to import.`);
                    }
                } else {
                    alert(`No valid miniatures found to import.`);
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
            <FilterControls />
        
            <div className="relative my-8 p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden">
                <GameLogoDisplay gameSystem={filters.gameSystem} />
                
                <div className="relative z-10">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <h2 className={`text-3xl font-bold ${activeTheme.primaryText} tracking-wider transition-colors duration-300`}>My Collection</h2>
                        <div className="flex flex-wrap items-center gap-4">
                             <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300">
                                <DownloadIcon /> Export to CSV
                            </button>
                            <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300 cursor-pointer">
                                <UploadIcon /> Import from CSV
                                <input type="file" accept=".csv" className="hidden" onChange={handleImportChange} ref={importInputRef} />
                            </label>
                            <button onClick={showFormForAddNew} className={`flex items-center gap-2 px-4 py-2 ${activeTheme.button} rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}>
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
                            theme={activeTheme}
                        />
                    )}

                    {isBulkEditModalOpen && (
                        <BulkEditModal
                            selectedCount={selectedIds.size}
                            onClose={() => setIsBulkEditModalOpen(false)}
                            onSave={handleBulkEdit}
                        />
                    )}

                    {isFormVisible && (
                        <MiniatureForm 
                            onSubmit={handleFormSubmit}
                            initialData={editingMiniature}
                            onCancel={hideForm}
                        />
                    )}

                    <MiniatureList 
                        miniatures={filteredMiniatures} 
                        onEdit={showFormForEdit} 
                        onDelete={deleteMiniature}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={() => handleSelectAll(filteredMiniatures.map(m => m.id))}
                    />
                </div>
            </div>
        </>
    );
};

export default CollectionPage;