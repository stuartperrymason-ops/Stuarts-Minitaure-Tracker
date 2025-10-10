import React from 'react';
import { Miniature } from '../types';
import { STATUS_COLORS } from '../constants';
import { PencilIcon, TrashIcon, SortIcon, SortAscIcon, SortDescIcon } from './Icons';

interface MiniatureListProps {
    miniatures: Miniature[];
    onEdit: (miniature: Miniature) => void;
    onDelete: (id: string) => void;
    onSort: (key: keyof Miniature) => void;
    sortConfig: { key: keyof Miniature; direction: 'asc' | 'desc' } | null;
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
        <th scope="col" className="px-6 py-3 text-left">
            <button 
                onClick={() => onSort(columnKey)} 
                className="flex items-center gap-2 w-full text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-md p-1 -m-1"
            >
                {title}
                <Icon />
            </button>
        </th>
    );
};


const MiniatureList: React.FC<MiniatureListProps> = ({ miniatures, onEdit, onDelete, onSort, sortConfig }) => {
    if (miniatures.length === 0) {
        return <p className="text-center text-gray-400 py-12">No miniatures match the current filters. Add one to get started!</p>;
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-gray-700/50">
                    <tr>
                        <SortableHeader title="Model Name" columnKey="modelName" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader title="Game System" columnKey="gameSystem" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader title="Army" columnKey="army" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader title="Count" columnKey="modelCount" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader title="Status" columnKey="status" onSort={onSort} sortConfig={sortConfig} />
                        <th scope="col" className="px-6 py-3 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                    {miniatures.map(mini => (
                        <tr key={mini.id} className="hover:bg-gray-700/50 transition-colors duration-200">
                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{mini.modelName}</th>
                            <td className="px-6 py-4 text-gray-400">{mini.gameSystem}</td>
                            <td className="px-6 py-4 text-gray-400">{mini.army}</td>
                            <td className="px-6 py-4 text-gray-400">{mini.modelCount}</td>
                            <td className="px-6 py-4">
                                <span className="flex items-center gap-2">
                                    <span style={{ backgroundColor: STATUS_COLORS[mini.status] }} className="h-3 w-3 rounded-full flex-shrink-0"></span>
                                    {mini.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 flex items-center gap-4">
                                <button onClick={() => onEdit(mini)} className="text-blue-400 hover:text-blue-300 transition-colors" aria-label={`Edit ${mini.modelName}`}>
                                    <PencilIcon />
                                </button>
                                <button onClick={() => onDelete(mini.id)} className="text-red-400 hover:text-red-300 transition-colors" aria-label={`Delete ${mini.modelName}`}>
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