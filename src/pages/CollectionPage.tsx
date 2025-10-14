import React from 'react';
import { useAppStore } from '../store';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import BulkActionBar from '../components/BulkActionBar';
import BulkEditModal from '../components/BulkEditModal';
import { PlusCircleIcon } from '../components/Icons';

const CollectionPage: React.FC = () => {
    const {
        miniatures,
        filters,
        setFilters,
        isFormVisible,
        editingMiniature,
        startAdding,
        addMiniature,
        updateMiniature,
        stopEditing,
        selectedIds,
        startBulkEditing,
        isBulkEditing,
        stopBulkEditing,
        deleteSelected,
        updateSelected,
        clearSelection,
        activeTheme
    } = useAppStore();

    const handleFormSubmit = (miniature: any) => {
        if (miniature._id) {
            updateMiniature(miniature);
        } else {
            addMiniature(miniature);
        }
    };
    
    const handleDeleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected miniatures? This action cannot be undone.`)) {
            deleteSelected();
        }
    };

    return (
        <>
            <FilterControls 
                filters={filters} 
                setFilters={setFilters} 
                allMiniatures={miniatures}
                theme={activeTheme}
            />
        
            <div className="my-8 p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm relative">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className={`text-3xl font-bold ${activeTheme.primaryText} tracking-wider transition-colors duration-300`}>My Collection</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <button onClick={startAdding} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                            <PlusCircleIcon />
                            Add New
                        </button>
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <BulkActionBar 
                        selectedCount={selectedIds.length}
                        onClear={clearSelection}
                        onDelete={handleDeleteSelected}
                        onEdit={startBulkEditing}
                        theme={activeTheme}
                    />
                )}

                {isFormVisible && (
                    <MiniatureForm 
                        onSubmit={handleFormSubmit}
                        initialData={editingMiniature}
                        onCancel={stopEditing}
                        theme={activeTheme}
                    />
                )}
                
                {isBulkEditing && (
                    <BulkEditModal 
                        onClose={stopBulkEditing}
                        onSave={updateSelected}
                        selectedCount={selectedIds.length}
                    />
                )}

                <MiniatureList />
            </div>
        </>
    );
};

export default CollectionPage;
