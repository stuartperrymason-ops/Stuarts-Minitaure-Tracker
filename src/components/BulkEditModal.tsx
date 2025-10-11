import React, { useState } from 'react';
import { Status } from '../types';
import { STATUSES } from '../constants';
import { Theme } from '../themes';
import Modal from './Modal';

interface BulkEditModalProps {
    onClose: () => void;
    onSave: (updates: { status?: Status; army?: string }) => void;
    theme: Theme;
    selectedCount: number;
}

const BulkEditModal: React.FC<BulkEditModalProps> = ({ onClose, onSave, theme, selectedCount }) => {
    const [status, setStatus] = useState<Status | ''>('');
    const [army, setArmy] = useState('');

    const handleSave = () => {
        const updates: { status?: Status; army?: string } = {};
        if (status) {
            updates.status = status;
        }
        if (army.trim()) {
            updates.army = army.trim();
        }
        if (Object.keys(updates).length > 0) {
            onSave(updates);
        } else {
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title={`Bulk Edit ${selectedCount} Item${selectedCount > 1 ? 's' : ''}`} theme={theme}>
            <div className="p-6 space-y-6 text-gray-300">
                <p>Apply changes to all selected miniatures. Leave a field blank to keep its original value.</p>
                <div>
                    <label htmlFor="bulk-status" className="block text-sm font-medium text-gray-300">New Status</label>
                    <select
                        id="bulk-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status | '')}
                        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                    >
                        <option value="">-- No Change --</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="bulk-army" className="block text-sm font-medium text-gray-300">New Army / Faction</label>
                    <input
                        type="text"
                        id="bulk-army"
                        value={army}
                        onChange={(e) => setArmy(e.target.value)}
                        placeholder="e.g., Ultramarines"
                        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-4 p-4 bg-gray-700/50">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors">
                    Cancel
                </button>
                <button type="button" onClick={handleSave} className={`px-6 py-2 ${theme.button} text-white font-semibold rounded-lg shadow-md transition-colors`}>
                    Apply Changes
                </button>
            </div>
        </Modal>
    );
};

export default BulkEditModal;
