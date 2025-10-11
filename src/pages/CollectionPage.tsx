import React, { useState } from 'react';
import { Miniature, Filter, Status } from '../types';
import { SortConfig } from '../App';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import { PlusCircleIcon } from '../components/Icons';
import { Theme } from '../themes';
import BulkActionBar from '../components/BulkActionBar';
import BulkEditModal from '../components/BulkEditModal';

interface CollectionPageProps {
    filteredMiniatures: Miniature[];
    allMiniatures: Miniature[];
    setMiniatures: React.Dispatch<React.SetStateAction<Miniature[]>>;
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
        filteredMiniatures, allMiniatures, setMiniatures, filters, setFilters, isFormVisible, editingMiniature,
        sortConfig, onAddNewClick, onFormSubmit, onCancelForm, onEdit,
        onDelete, onSort, theme
    } = props;

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);

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
            // Deselect all filtered
            setSelectedIds(prev => {
                const newSet = new Set(prev);
                for (const id of currentFilteredIds) {
                    newSet.delete(id);
                }
                return newSet;
            });
        } else {
            // Select all filtered
            setSelectedIds(prev => new Set([...Array.from(prev), ...filteredIds]));
        }
    };
    
    const clearSelection = () => setSelectedIds(new Set());

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected miniatures? This action cannot be undone.`)) {
            const originalMiniatures = [...allMiniatures];
            const updatedList = allMiniatures.filter(m => !selectedIds.has(m.id));
            setMiniatures(updatedList);

            const idsToDelete = Array.from(selectedIds);
            clearSelection();
            
            try {
                const responses = await Promise.all(
                    idsToDelete.map(id => fetch(`/api/miniatures/${id}`, { method: 'DELETE' }))
                );
                if (responses.some(res => !res.ok)) {
                    throw new Error('Some miniatures failed to delete from the server.');
                }
            } catch (error) {
                console.error(error);
                alert('Error: Could not bulk delete miniatures. Reverting changes.');
                setMiniatures(originalMiniatures);
            }
        }
    };

    const handleBulkSave = async (updates: { status?: Status; army?: string }) => {
        const originalMiniatures = [...allMiniatures];
        const updatedList = allMiniatures.map(m => 
            selectedIds.has(m.id) ? { ...m, ...updates } : m
        );
        setMiniatures(updatedList);

        const idsToUpdate = new Set(selectedIds);
        setIsBulkEditModalOpen(false);
        clearSelection();

        try {
            const miniaturesToUpdate = updatedList.filter(m => idsToUpdate.has(m.id));
            const responses = await Promise.all(
                miniaturesToUpdate.map(m => 
                    fetch(`/api/miniatures/${m.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(m),
                    })
                )
            );
            if (responses.some(res => !res.ok)) {
                throw new Error('Some miniatures failed to update on the server.');
            }
        } catch (error) {
            console.error(error);
            alert('Error: Could not bulk update miniatures. Reverting changes.');
            setMiniatures(originalMiniatures);
        }
    };

    return (
        <>
            <FilterControls 
                filters={filters} 
                setFilters={setFilters} 
                allMiniatures={allMiniatures}
                theme={theme}
            />
        
            <div className="my-8 p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className={`text-3xl font-bold ${theme.primaryText} tracking-wider transition-colors duration-300`}>My Collection</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <button onClick={onAddNewClick} className={`flex items-center gap-2 px-4 py-2 ${theme.button} rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}>
                            <PlusCircleIcon />
                            Add New
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
                        onSave={handleBulkSave}
                        theme={theme}
                    />
                )}

                {isFormVisible && (
                    <MiniatureForm 
                        onSubmit={onFormSubmit}
                        initialData={editingMiniature}
                        onCancel={onCancelForm}
                        theme={theme}
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
