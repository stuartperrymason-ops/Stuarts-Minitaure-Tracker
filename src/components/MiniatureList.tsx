import React, { useState } from 'react';
import { Miniature } from '../types';
import { STATUS_COLORS } from '../constants';
import { PencilIcon, TrashIcon, SortIcon, SortAscIcon, SortDescIcon, ChevronDownIcon, ChevronRightIcon } from './Icons';

interface MiniatureListProps {
    miniatures: Miniature[];
    onEdit: (miniature: Miniature) => void;
    onDelete: (id: string) => void;
    onSort: (key: keyof Miniature) => void;
    sortConfig: { key: keyof Miniature; direction: 'asc' | 'desc' } | null;
    // FIX: Add props to handle bulk selection state.
    selectedIds: Set<string>;
    onSelect: (id: string) => void;
    onSelectAll: () => void;
}

const SortableHeader: React.FC<{
    title: string;
    columnKey: keyof Miniature;
    onSort: (key: keyof Miniature) => void;
    sortConfig: MiniatureListProps['sortConfig'];
}> = ({ title, columnKey, onSort, sortConfig }) => {
    const isSorted = sortConfig?.key === columnKey;
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


const MiniatureList: React.FC<MiniatureListProps> = ({ miniatures, onEdit, onDelete, onSort, sortConfig, selectedIds, onSelect, onSelectAll }) => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    if (miniatures.length === 0) {
        return <p className="text-center text-gray-500 py-8">No miniatures match the current filters. Add one to get started!</p>;
    }
    
    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-gray-700/50">
                    <tr>
                        {/* FIX: Add a header checkbox for "select all" functionality. */}
                        <th scope="col" className="px-6 py-3">
                            <input
                                type="checkbox"
                                checked={miniatures.length > 0 && miniatures.every(m => selectedIds.has(m.id))}
                                onChange={onSelectAll}
                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"
                            />
                        </th>
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
                    {miniatures.map(mini => (
                        <React.Fragment key={mini.id}>
                            <tr className="bg-gray-800/50 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                {/* FIX: Add a checkbox for selecting individual rows. */}
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(mini.id)}
                                        onChange={() => onSelect(mini.id)}
                                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"
                                    />
                                </td>
                                <td className="px-6 py-4">
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
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => onEdit(mini)} className="font-medium text-blue-400 hover:underline">
                                        <PencilIcon />
                                    </button>
                                    <button onClick={() => onDelete(mini.id)} className="font-medium text-red-400 hover:underline">
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                            {mini.notes && expandedIds.has(mini.id) && (
                                <tr className="bg-gray-800/60" id={`notes-${mini.id}`}>
                                    {/* FIX: Adjust colSpan to account for the new checkbox column. */}
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
