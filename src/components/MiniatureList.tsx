/**
 * @file src/components/MiniatureList.tsx
 * This component renders the main table for displaying the miniature collection.
 * It includes features for sorting, editing, deleting, and selecting items for bulk actions.
 */

import React from 'react';
import { Miniature } from '../types';
import { useAppStore } from '../store';
import { STATUS_COLORS } from '../constants';
import { PencilIcon, TrashIcon, SortIcon, SortAscIcon, SortDescIcon, PhotographIcon } from './Icons';

// Defines the props for the reusable SortableHeader component.
interface SortableHeaderProps {
    title: string;
    columnKey: keyof Miniature;
}

/**
 * A reusable header cell component for the table that includes sorting controls.
 * @param {SortableHeaderProps} props The component's properties.
 * @returns {JSX.Element} The rendered table header cell.
 */
const SortableHeader: React.FC<SortableHeaderProps> = ({ title, columnKey }) => {
    // Select state and actions from the Zustand store.
    const { sortConfig, setSortConfig } = useAppStore();

    // Determine if this column is the one currently being sorted.
    const isSorted = sortConfig?.key === columnKey;
    // Choose the correct icon based on the current sort state.
    const Icon = isSorted 
        ? (sortConfig.direction === 'asc' ? SortAscIcon : SortDescIcon) 
        : SortIcon;

    return (
        <th scope="col" className="px-6 py-3">
            <button 
                onClick={() => setSortConfig(columnKey)} 
                className="flex items-center gap-2 w-full text-left text-xs text-cyan-300 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-md p-1 -m-1"
            >
                {title}
                <Icon />
            </button>
        </th>
    );
};

/**
 * The main component for displaying the list of miniatures.
 * @returns {JSX.Element} The rendered table or a placeholder message.
 */
const MiniatureList: React.FC = () => {
    // Select all necessary state and actions from the store.
    const { 
        filteredMiniatures, 
        startEditing, 
        deleteMiniature,
        selectedIds,
        toggleSelection,
        isAllSelected,
        toggleSelectAll,
        openImageGallery,
    } = useAppStore();
    
    // If the filtered list is empty, show a message instead of the table.
    if (filteredMiniatures.length === 0) {
        return <p className="text-center text-gray-500 py-8">No miniatures match the current filters. Add one to get started!</p>;
    }
    
    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-gray-700/50">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all"
                                    type="checkbox"
                                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                                <label htmlFor="checkbox-all" className="sr-only">select all items</label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-xs text-cyan-300 uppercase">Thumbnail</th>
                        <SortableHeader title="Model Name" columnKey="modelName" />
                        <SortableHeader title="Game System" columnKey="gameSystem" />
                        <SortableHeader title="Army" columnKey="army" />
                        <SortableHeader title="Count" columnKey="modelCount" />
                        <SortableHeader title="Status" columnKey="status" />
                        <th scope="col" className="px-6 py-3 text-xs text-cyan-300 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMiniatures.map(mini => (
                        <tr 
                            key={mini._id} 
                            className={`border-b border-gray-700 transition-colors ${
                                selectedIds.includes(mini._id) ? 'bg-cyan-900/50' : 'bg-gray-800/50 hover:bg-gray-700/50'
                            }`}
                        >
                            <td className="w-4 p-4">
                                 <div className="flex items-center">
                                    <input
                                        id={`checkbox-${mini._id}`}
                                        type="checkbox"
                                        className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                                        checked={selectedIds.includes(mini._id)}
                                        onChange={() => toggleSelection(mini._id)}
                                    />
                                    <label htmlFor={`checkbox-${mini._id}`} className="sr-only">select item</label>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => mini.images && mini.images.length > 0 && openImageGallery(mini)}
                                    className="w-16 h-12 flex items-center justify-center bg-gray-700 rounded-md overflow-hidden disabled:cursor-default"
                                    disabled={!mini.images || mini.images.length === 0}
                                    aria-label="View images"
                                >
                                    {mini.images && mini.images.length > 0 ? (
                                        <img src={mini.images[0]} alt={mini.modelName} className="w-full h-full object-cover" />
                                    ) : (
                                        <PhotographIcon />
                                    )}
                                </button>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{mini.modelName}</th>
                            <td className="px-6 py-4">{mini.gameSystem}</td>
                            <td className="px-6 py-4">{mini.army}</td>
                            <td className="px-6 py-4">{mini.modelCount}</td>
                            <td className="px-6 py-4">
                                <span className="flex items-center gap-2">
                                    <span style={{ backgroundColor: STATUS_COLORS[mini.status] }} className="h-3 w-3 rounded-full"></span>
                                    {mini.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 flex items-center gap-4">
                                <button onClick={() => startEditing(mini)} className="font-medium text-blue-400 hover:underline" title="Edit">
                                    <PencilIcon />
                                </button>
                                <button onClick={() => window.confirm('Are you sure you want to delete this miniature?') && deleteMiniature(mini._id)} className="font-medium text-red-400 hover:underline" title="Delete">
                                    <TrashIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MiniatureList;