import React from 'react';
import { Miniature, Filter } from '../types';
// FIX: Import SortConfig from the centralized types.ts file.
import { SortConfig } from '../types';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import { PlusCircleIcon, UndoIcon, RedoIcon } from '../components/Icons';
import { Theme } from '../themes';

interface CollectionPageProps {
    filteredMiniatures: Miniature[];
    allMiniatures: Miniature[];
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    isFormVisible: boolean;
    editingMiniature: Miniature | null;
    sortConfig: SortConfig;
    canUndo: boolean;
    canRedo: boolean;
    onAddNewClick: () => void;
    onFormSubmit: (miniature: Omit<Miniature, '_id'> | Miniature) => void;
    onCancelForm: () => void;
    onEdit: (miniature: Miniature) => void;
    onDelete: (id: string) => void;
    onSort: (key: keyof Miniature) => void;
    onUndo: () => void;
    onRedo: () => void;
    theme: Theme;
}

const CollectionPage: React.FC<CollectionPageProps> = (props) => {
    const {
        filteredMiniatures, allMiniatures, filters, setFilters, isFormVisible, editingMiniature,
        sortConfig, canUndo, canRedo, onAddNewClick, onFormSubmit, onCancelForm, onEdit,
        onDelete, onSort, onUndo, onRedo, theme
    } = props;

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
                            <button onClick={onUndo} disabled={!canUndo} className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            <UndoIcon /> Undo
                        </button>
                            <button onClick={onRedo} disabled={!canRedo} className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            <RedoIcon /> Redo
                        </button>
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

                <MiniatureList 
                    miniatures={filteredMiniatures} 
                    onEdit={onEdit} 
                    onDelete={onDelete}
                    onSort={onSort}
                    sortConfig={sortConfig}
                />
            </div>
        </>
    );
};

export default CollectionPage;