import React, { useState } from 'react';
import { Status } from '../types';
import { useAppStore } from '../store';
import { STATUSES } from '../constants';
import Modal from './Modal';

interface BulkEditModalProps {
    onClose: () => void;
    onSave: (updates: { status?: Status; army?: string, gameSystem?: string, notes?: string }) => void;
    selectedCount: number;
}

const BulkEditModal: React.FC<BulkEditModalProps> = ({ onClose, onSave, selectedCount }) => {
    const { gameSystems: allGameSystems, activeTheme } = useAppStore();

    const [status, setStatus] = useState<Status | ''>('');
    const [army, setArmy] = useState('');
    const [gameSystem, setGameSystem] = useState<string | ''>('');
    const [notes, setNotes] = useState('');
    const [updateNotes, setUpdateNotes] = useState(false);

    const handleSave = () => {
        const updates: { status?: Status; army?: string; gameSystem?: string, notes?: string } = {};
        if (status) updates.status = status;
        if (army.trim()) updates.army = army.trim();
        if (gameSystem) updates.gameSystem = gameSystem;
        if (updateNotes) updates.notes = notes;

        if (Object.keys(updates).length > 0) {
            onSave(updates);
        }
        onClose();
    };

    return (
        <Modal onClose={onClose} title={`Bulk Edit ${selectedCount} Item${selectedCount > 1 ? 's' : ''}`} theme={activeTheme}>
            <div className="p-6 space-y-6 text-gray-300">
                <p>Apply changes to all selected miniatures. Leave a field blank to keep its original value.</p>
                <div>
                    <label htmlFor="bulk-gameSystem" className="block text-sm font-medium text-gray-300">New Game System</label>
                    <select
                        id="bulk-gameSystem"
                        value={gameSystem}
                        onChange={(e) => setGameSystem(e.target.value)}
                        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}
                    >
                        <option value="">-- No Change --</option>
                        {allGameSystems.map(gs => <option key={gs} value={gs}>{gs}</option>)}
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
                        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}
                    />
                </div>
                 <div>
                    <label htmlFor="bulk-status" className="block text-sm font-medium text-gray-300">New Status</label>
                    <select
                        id="bulk-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status | '')}
                        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}
                    >
                        <option value="">-- No Change --</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                        <input
                            type="checkbox"
                            checked={updateNotes}
                            onChange={(e) => setUpdateNotes(e.target.checked)}
                            className={`h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500`}
                        />
                         <span>Update Notes</span>
                    </label>
                    <textarea
                        id="bulk-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter new notes. Leave blank to clear notes."
                        disabled={!updateNotes}
                        rows={3}
                        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing} ${!updateNotes ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-4 p-4 bg-gray-700/50">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors">
                    Cancel
                </button>
                <button type="button" onClick={handleSave} className={`px-6 py-2 ${activeTheme.button} text-white font-semibold rounded-lg shadow-md transition-colors`}>
                    Apply Changes
                </button>
            </div>
        </Modal>
    );
};

export default BulkEditModal;
