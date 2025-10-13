/**
 * @file src/components/MiniatureList.tsx
 * This component displays the collection of miniatures in a sortable, interactive table.
 * It includes features for editing, deleting, bulk selection, and viewing notes.
 */

import React, { useState } from 'react';
import { Miniature } from '../types';
import { STATUS_COLORS } from '../constants';
import { PencilIcon, TrashIcon, SortIcon, SortAscIcon, SortDescIcon, ChevronDownIcon, ChevronRightIcon } from './Icons';

// Defines the props expected by the MiniatureList component.
interface MiniatureListProps {
    miniatures: Miniature[]; // The array of miniatures to display (already filtered and sorted).
    onEdit: (miniature: Miniature) => void; // Callback to handle editing a miniature.
    onDelete: (id: string) => void; // Callback to handle deleting a miniature.
    onSort: (key: keyof Miniature) => void; // Callback to handle sorting the list.
    sortConfig: { key: keyof Miniature; direction: 'asc' | 'desc' } | null; // The current sort configuration.
    selectedIds: Set<string>; // A Set of IDs for the miniatures that are currently selected.
    onSelect: (id: string) => void; // Callback to toggle the selection of a single miniature.
    onSelectAll: () => void; // Callback to toggle the selection of all visible miniatures.
}

/**
 * A reusable component for table headers that allows sorting when clicked.
 * @param {{ title: string, columnKey: keyof Miniature, onSort: Function, sortConfig: object }} props The component props.
 * @returns {JSX.Element} A sortable table header cell.
 */
const SortableHeader: React.FC<{
    title: string;
    columnKey: keyof Miniature;
    onSort: (key: keyof Miniature) => void;
    sortConfig: MiniatureListProps['sortConfig'];
}> = ({ title, columnKey, onSort, sortConfig }) => {
    // Determine if this header's column is the one currently being sorted.
    const isSorted = sortConfig?.key === columnKey;
    // Choose the appropriate sort icon based on the current sort state.
    const Icon = isSorted 
        ? (sortConfig.direction === 'asc' ? SortAscIcon : SortDescIcon) 
        : SortIcon;

    return (
        <th scope="col" className="px-6 py-3">
            <button 
                onClick={() => onSort(columnKey)} 
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
 * @param {MiniatureListProps} props The properties passed to the component.
 * @returns {JSX.Element} The rendered table of miniatures.
 */
const MiniatureList: React.FC<MiniatureListProps> = ({ miniatures, onEdit, onDelete, onSort, sortConfig, selectedIds, onSelect, onSelectAll }) => {
    // State to keep track of which miniatures have their notes section expanded.
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    /**
     * Toggles the expanded state for a given miniature's notes.
     * @param {string} id The ID of the miniature to toggle.
     */
    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id); // If already expanded, collapse it.
            } else {
                newSet.add(id); // If collapsed, expand it.
            }
            return newSet;
        });
    };
    
    // If there are no miniatures to display, show a message instead of the table.
    if (miniatures.length === 0) {
        return <p className="text-center text-gray-500 py-8">No miniatures match the current filters. Add one to get started!</p>;
    }
    
    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-gray-700/50">
                    <tr>
                        {/* Header for the "select all" checkbox */}
                        <th scope="col" className="px-6 py-3">
                            <input
                                type="checkbox"
                                // The checkbox is checked if all visible miniatures are selected.
                                checked={miniatures.length > 0 && miniatures.every(m => selectedIds.has(m.id))}
                                onChange={onSelectAll}
                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"
                            />
                        </th>
                        {/* Header for the expand/collapse notes icon */}
                        <th scope="col" className="w-12 px-6 py-3"></th>
                        <SortableHeader title="Model Name" columnKey="modelName" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader title="Game System" columnKey="gameSystem" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader title="Army" columnKey="army" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader title="Count" columnKey="modelCount" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader title="Status" columnKey="status" onSort={onSort} sortConfig={sortConfig} />
                        <th scope="col" className="px-6 py-3 text-xs text-cyan-300 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map over the miniatures array to create a table row for each one. */}
                    {miniatures.map(mini => (
                        // React.Fragment is used to group the main row and the optional notes row without adding extra nodes to the DOM.
                        <React.Fragment key={mini.id}>
                            <tr className="bg-gray-800/50 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                {/* Checkbox for selecting an individual row */}
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(mini.id)}
                                        onChange={() => onSelect(mini.id)}
                                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"
                                    />
                                </td>
                                {/* Cell for the expand/collapse notes button */}
                                <td className="px-6 py-4">
                                    {/* The button is only rendered if the miniature has notes. */}
                                    {mini.notes && (
                                        <button onClick={() => toggleExpand(mini.id)} className="text-gray-400 hover:text-white" aria-expanded={expandedIds.has(mini.id)} aria-controls={`notes-${mini.id}`}>
                                            {expandedIds.has(mini.id) ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                        </button>
                                    )}
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
                                {/* Action buttons for edit and delete */}
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => onEdit(mini)} className="font-medium text-blue-400 hover:underline">
                                        <PencilIcon />
                                    </button>
                                    <button onClick={() => onDelete(mini.id)} className="font-medium text-red-400 hover:underline">
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                            {/* Conditional rendering for the notes row. */}
                            {mini.notes && expandedIds.has(mini.id) && (
                                <tr className="bg-gray-800/60" id={`notes-${mini.id}`}>
                                    {/* The cell spans all columns to create a full-width notes section. */}
                                    <td colSpan={8} className="px-12 py-4">
                                        <div className="p-4 bg-gray-900/50 rounded-md">
                                            <h4 className="font-semibold text-gray-200 mb-2 border-b border-gray-700 pb-1">Notes:</h4>
                                            <p className="text-gray-300 whitespace-pre-wrap">{mini.notes}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MiniatureList;
