import React, { useState } from 'react';
import { Miniature, Filter, Status } from '../types';
import { SortConfig } from '../App';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import BulkActionBar from '../components/BulkActionBar';
import BulkEditModal from '../components/BulkEditModal';
import { PlusCircleIcon } from '../components/Icons';
import { Theme } from '../themes';

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
        if (selectedIds.size === filteredIds.length) {
            setSelectedIds(new Set()); // Deselect all
        } else {
            setSelectedIds(new Set(filteredIds)); // Select all
        }
    };
    
    const handleBulkDelete = async () => {
        const idsToDelete = Array.from(selectedIds);
        if (idsToDelete.length === 0) return;

        if (window.confirm(`Are you sure you want to delete ${idsToDelete.length} selected items? This action cannot be undone.`)) {
            try {
                const response = await fetch('/api/miniatures/bulk-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: idsToDelete }),
                });

                if (!response.ok) {
                    throw new Error('Failed to bulk delete miniatures');
                }

                setMiniatures(prev => prev.filter(m => !idsToDelete.includes(m.id)));
                setSelectedIds(new Set());

            } catch (error) {
                console.error(error);
                alert('Error: Could not delete selected miniatures from the database.');
            }
        }
    };

    const handleBulkEdit = async (updates: Partial<Pick<Miniature, 'status' | 'army'>>) => {
        const idsToUpdate = Array.from(selectedIds);
        if (idsToUpdate.length === 0) return;

        try {
            const response = await fetch('/api/miniatures/bulk-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: idsToUpdate, updates }),
            });

            if (!response.ok) {
                throw new Error('Failed to bulk update miniatures');
            }
            
            const updatedMiniatures = await response.json();
            const updatedMap = new Map(updatedMiniatures.map((m: Miniature) => [m.id, m]));
            
            setMiniatures(prev => prev.map(m => updatedMap.get(m.id) || m));
            setSelectedIds(new Set());
            setIsBulkEditModalOpen(false);
        } catch (error) {
            console.error(error);
             alert('Error: Could not update selected miniatures in the database.');
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
                        <button onClick={onAddNewClick} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                            <PlusCircleIcon />
                            Add New
                        </button>
                    </div>
                </div>

                {isFormVisible && (
                    <MiniatureForm 
                        onSubmit={onFormSubmit}
                        initialData={editingMiniature}
                        onCancel={onCancelForm}
                        theme={theme}
                    />
                )}
                
                {selectedIds.size > 0 && (
                    <BulkActionBar
                        selectedCount={selectedIds.size}
                        onClear={() => setSelectedIds(new Set())}
                        onDelete={handleBulkDelete}
                        onEdit={() => setIsBulkEditModalOpen(true)}
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
                    onSelectAll={handleSelectAll}
                />
            </div>

            {isBulkEditModalOpen && (
                <BulkEditModal
                    onClose={() => setIsBulkEditModalOpen(false)}
                    onSave={handleBulkEdit}
                    theme={theme}
                    selectedCount={selectedIds.size}
                />
            )}
        </>
    );
};

export default CollectionPage;
