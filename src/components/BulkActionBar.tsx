/**
 * @file src/components/BulkActionBar.tsx
 * This component displays an action bar that appears when one or more items
 * in the miniature list are selected. It provides buttons for bulk operations like editing and deleting.
 */

import React from 'react';
import { Theme } from '../themes';
import { PencilIcon, TrashIcon, XCircleIcon } from './Icons';

// Defines the props for the BulkActionBar component.
interface BulkActionBarProps {
    selectedCount: number; // The number of items currently selected.
    onClear: () => void; // Callback function to clear the current selection.
    onDelete: () => void; // Callback function to initiate bulk deletion.
    onEdit: () => void; // Callback function to open the bulk edit modal.
    theme: Theme; // The active theme object for styling.
}

/**
 * A UI bar for performing actions on multiple selected items.
 * @param {BulkActionBarProps} props The properties passed to the component.
 * @returns {JSX.Element} The rendered action bar.
 */
const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, onClear, onDelete, onEdit, theme }) => {
    return (
        // The bar has a subtle entrance animation.
        <div className="flex items-center justify-between p-4 mb-4 bg-gray-700/50 border border-gray-600 rounded-lg animate-fade-in-down">
            {/* Left side: Clear selection button and count display */}
            <div className="flex items-center gap-4">
                <button onClick={onClear} className="text-gray-400 hover:text-white transition-colors" aria-label="Clear selection">
                    <XCircleIcon />
                </button>
                <p className="font-semibold text-white">{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</p>
            </div>
            {/* Right side: Action buttons */}
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
