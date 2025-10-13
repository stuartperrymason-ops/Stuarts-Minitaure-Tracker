/**
 * @file src/pages/CollectionPage.tsx
 * This component serves as the main page for viewing and managing the miniature collection.
 * It integrates various child components like filters, action bars, and the miniature list,
 * and orchestrates their state via the central Zustand store.
 */
import React from 'react';
import { useAppStore } from '../store';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import BulkActionBar from '../components/BulkActionBar';
import BulkEditModal from '../components/BulkEditModal';
import Modal from '../components/Modal';
import { PlusCircleIcon } from '../components/Icons';
import GameLogoDisplay from '../components/GameLogoDisplay';
import ImageGalleryModal from '../components/ImageGalleryModal';

/**
 * The main page for the collection.
 * @returns {JSX.Element} The rendered collection page.
 */
const CollectionPage: React.FC = () => {
    // Select all necessary state and actions from the store. This hook ensures the component
    // re-renders whenever any of these selected state values change.
    const {
        isFormVisible,
        editingMiniature,
        startAdding,
        stopEditing,
        addMiniature,
        updateMiniature,
        selectedIds,
        clearSelection,
        deleteSelected,
        isBulkEditing,
        startBulkEditing,
        stopBulkEditing,
        updateSelected,
        activeTheme,
        filters,
        isGalleryOpen,
        galleryMiniature,
        closeImageGallery,
    } = useAppStore();

    /**
     * Handles the submission of the add/edit form.
     * It determines whether to call the `update` or `add` action based on
     * whether the submitted object has an `_id`.
     */
    const handleFormSubmit = (miniature: any) => {
        if ('_id' in miniature) {
            updateMiniature(miniature);
        } else {
            addMiniature(miniature);
        }
    };

    /**
     * Handles saving the bulk edit form.
     */
    const handleBulkSave = (updates: any) => {
        updateSelected(updates);
    };

    return (
        <>
            <FilterControls />
        
            <div className="my-8 p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Decorative background logo */}
                <GameLogoDisplay gameSystem={filters.gameSystem} />

                {/* Main content container with a higher z-index to appear above the logo */}
                <div className="relative z-10">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <h2 className={`text-3xl font-bold ${activeTheme.primaryText} tracking-wider transition-colors duration-300`}>My Collection</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <button onClick={startAdding} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                                <PlusCircleIcon />
                                Add New
                            </button>
                        </div>
                    </div>

                    {/* Conditionally render the bulk action bar if items are selected */}
                    {selectedIds.length > 0 && (
                        <BulkActionBar
                            selectedCount={selectedIds.length}
                            onClear={clearSelection}
                            onDelete={() => window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`) && deleteSelected()}
                            onEdit={startBulkEditing}
                            theme={activeTheme}
                        />
                    )}
                    
                    {/* The main list/table of miniatures */}
                    <MiniatureList />
                </div>
            </div>

            {/* Conditionally render the Add/Edit modal */}
            {isFormVisible && (
                <Modal 
                    onClose={stopEditing}
                    title={editingMiniature ? 'Edit Miniature' : 'Add New Miniature'}
                    theme={activeTheme}
                >
                    <MiniatureForm 
                        onSubmit={handleFormSubmit}
                        initialData={editingMiniature}
                        onClose={stopEditing}
                    />
                </Modal>
            )}

            {/* Conditionally render the Bulk Edit modal */}
            {isBulkEditing && (
                 <BulkEditModal
                    onClose={stopBulkEditing}
                    onSave={handleBulkSave}
                    selectedCount={selectedIds.length}
                />
            )}
            
            {/* Conditionally render the Image Gallery modal */}
            {isGalleryOpen && galleryMiniature && (
                <ImageGalleryModal
                    miniature={galleryMiniature}
                    onClose={closeImageGallery}
                />
            )}
        </>
    );
};

export default CollectionPage;