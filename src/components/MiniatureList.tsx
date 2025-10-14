import React from 'react';
import { useAppStore } from '../store';
import { Miniature } from '../types';
import { STATUS_COLORS } from '../constants';
import { PencilIcon, TrashIcon, SortIcon, SortAscIcon, SortDescIcon } from './Icons';

interface SortableHeaderProps {
    title: string;
    columnKey: keyof Miniature;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ title, columnKey }) => {
    const { sortConfig, setSortConfig } = useAppStore();
    const isSorted = sortConfig?.key === columnKey;
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

const MiniatureList: React.FC = () => {
    const { 
        filteredMiniatures,
        deleteMiniature,
        startEditing,
        selectedIds,
        toggleSelection,
        toggleSelectAll,
        isAllSelected,
        activeTheme
    } = useAppStore();

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMiniature(id);
        }
    };

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
                                    id="checkbox-all-search" 
                                    type="checkbox" 
                                    className={`w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500`}
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                            </div>
                        </th>
                        <SortableHeader title="Model Name" columnKey="modelName" />
                        <SortableHeader title="Game System" columnKey="gameSystem" />
                        <SortableHeader title="Army" columnKey="army" />
                        <SortableHeader title="Count" columnKey="modelCount" />
                        <SortableHeader title="Status" columnKey="status" />
                        <th scope="col" className="px-6 py-3 text-xs text-cyan-300 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMiniatures.map(mini => {
                        const isSelected = selectedIds.includes(mini._id);
                        return (
                            <tr 
                                key={mini._id} 
                                className={`border-b border-gray-700 transition-colors ${isSelected ? 'bg-cyan-900/50' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input 
                                            id={`checkbox-table-search-${mini._id}`} 
                                            type="checkbox" 
                                            className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                                            checked={isSelected}
                                            onChange={() => toggleSelection(mini._id)}
                                        />
                                        <label htmlFor={`checkbox-table-search-${mini._id}`} className="sr-only">checkbox</label>
                                    </div>
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
                                    <button onClick={() => startEditing(mini)} className="font-medium text-blue-400 hover:text-white transition-colors" aria-label={`Edit ${mini.modelName}`}>
                                        <PencilIcon />
                                    </button>
                                    <button onClick={() => handleDelete(mini._id, mini.modelName)} className="font-medium text-red-400 hover:text-white transition-colors" aria-label={`Delete ${mini.modelName}`}>
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MiniatureList;