import React from 'react';
import { Theme } from '../themes';
import { PencilIcon, TrashIcon, XCircleIcon } from './Icons';

interface BulkActionBarProps {
    selectedCount: number;
    onClear: () => void;
    onDelete: () => void;
    onEdit: () => void;
    theme: Theme;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, onClear, onDelete, onEdit, theme }) => {
    return (
        <div className="flex items-center justify-between p-4 mb-4 bg-gray-700/50 border border-gray-600 rounded-lg animate-fade-in">
            <div className="flex items-center gap-4">
                <button onClick={onClear} className="text-gray-400 hover:text-white transition-colors" aria-label="Clear selection">
                    <XCircleIcon />
                </button>
                <p className="font-semibold text-white">{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</p>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300"
                >
                    <PencilIcon />
                    Edit Selected
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-500 rounded-lg shadow-md transition-all duration-300"
                >
                    <TrashIcon />
                    Delete Selected
                </button>
            </div>
        </div>
    );
};

export default BulkActionBar;
