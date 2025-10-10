
import React from 'react';
import { Miniature } from '../types';
import { STATUS_COLORS } from '../constants';
import { PencilIcon, TrashIcon } from './Icons';

interface MiniatureListProps {
    miniatures: Miniature[];
    onEdit: (miniature: Miniature) => void;
    onDelete: (id: string) => void;
}

const MiniatureList: React.FC<MiniatureListProps> = ({ miniatures, onEdit, onDelete }) => {
    if (miniatures.length === 0) {
        return <p className="text-center text-gray-500 py-8">No miniatures match the current filters. Add one to get started!</p>;
    }
    
    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-cyan-300 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Model Name</th>
                        <th scope="col" className="px-6 py-3">Game System</th>
                        <th scope="col" className="px-6 py-3">Army</th>
                        <th scope="col" className="px-6 py-3">Count</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {miniatures.map(mini => (
                        <tr key={mini.id} className="bg-gray-800/50 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MiniatureList;
