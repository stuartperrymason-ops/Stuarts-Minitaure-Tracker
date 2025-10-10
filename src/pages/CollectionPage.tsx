import React from 'react';
import { Miniature, Filter } from '../types';
import { SortConfig } from '../App';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import Modal from '../components/Modal';
import { PlusCircleIcon, UndoIcon, RedoIcon, SearchIcon } from '../components/Icons';
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
    onFormSubmit: (miniature: Omit<Miniature, 'id'> | Miniature) => void;
    onCancelForm: () => void;
    onEdit: (miniature: Miniature) => void;
    onDelete: (id: string) => void;
    onSort: (key: keyof Miniature) => void;
    onUndo: () => void;
    onRedo: () => void;
    theme: Theme;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const CollectionPage: React.FC<CollectionPageProps> = (props) => {
    const {
        filteredMiniatures, allMiniatures, filters, setFilters, isFormVisible, editingMiniature,
        sortConfig, canUndo, canRedo, onAddNewClick, onFormSubmit, onCancelForm, onEdit,
        onDelete, onSort, onUndo, onRedo, theme, searchQuery, setSearchQuery
    } = props;

    return (
        <>
            <Modal
                isOpen={isFormVisible}
                onClose={onCancelForm}
                title={editingMiniature ? 'Edit Miniature' : 'Add New Miniature'}
            >
                <MiniatureForm 
                    onSubmit={onFormSubmit}
                    initialData={editingMiniature}
                    onCancel={onCancelForm}
                    theme={theme}
                />
            </Modal>

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50">
                     <div className="relative w-full md:w-auto md:flex-1 md:min-w-0">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon />
                        </span>
                        <input
                            type="search"
                            placeholder="Search collection..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onUndo} disabled={!canUndo} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            <UndoIcon /> <span className="hidden sm:inline">Undo</span>
                        </button>
                        <button onClick={onRedo} disabled={!canRedo} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            <RedoIcon /> <span className="hidden sm:inline">Redo</span>
                        </button>
                        <button onClick={onAddNewClick} className={`flex items-center gap-2 px-3 py-2 ${theme.button} text-white font-semibold rounded-lg shadow-md transition-all duration-200`}>
                            <PlusCircleIcon />
                            <span className="hidden sm:inline">Add New</span>
                        </button>
                    </div>
                </div>

                <FilterControls 
                    filters={filters} 
                    setFilters={setFilters} 
                    allMiniatures={allMiniatures}
                    theme={theme}
                />
            
                <div className="p-4 sm:p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700/50">
                    <h2 className={`text-2xl font-bold ${theme.primaryText} mb-4 transition-colors duration-300`}>My Collection ({filteredMiniatures.length})</h2>
                    <MiniatureList 
                        miniatures={filteredMiniatures} 
                        onEdit={onEdit} 
                        onDelete={onDelete}
                        onSort={onSort}
                        sortConfig={sortConfig}
                    />
                </div>
            </div>
        </>
    );
};

export default CollectionPage;