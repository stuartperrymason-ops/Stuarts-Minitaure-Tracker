/**
 * @file src/components/BulkEditModal.tsx
 * This component provides a modal form for editing multiple miniatures at once.
 * Users can choose to update the status, army, game system, and notes for all selected items.
 */

import React, { useState } from 'react';
import { Status } from '../types';
import { STATUSES } from '../constants';
import { Theme } from '../themes';
import Modal from './Modal';

// Defines the props for the BulkEditModal component.
interface BulkEditModalProps {
    onClose: () => void; // Callback to close the modal.
    onSave: (updates: { status?: Status; army?: string, gameSystem?: string, notes?: string }) => void; // Callback to save the changes.
    theme: Theme; // Active theme for styling.
    selectedCount: number; // The number of items being edited.
    allGameSystems: string[]; // List of all available game systems for the dropdown.
}

/**
 * A modal dialog for applying bulk edits to selected miniatures.
 * @param {BulkEditModalProps} props The component's properties.
 * @returns {JSX.Element} The rendered modal component.
 */
const BulkEditModal: React.FC<BulkEditModalProps> = ({ onClose, onSave, theme, selectedCount, allGameSystems }) => {
    // State for each field in the bulk edit form.
    const [status, setStatus] = useState<Status | ''>('');
    const [army, setArmy] = useState('');
    const [gameSystem, setGameSystem] = useState<string | ''>('');
    const [notes, setNotes] = useState('');
    // A separate boolean state to control whether the notes field should be updated.
    // This allows users to clear the notes field intentionally.
    const [updateNotes, setUpdateNotes] = useState(false);

    /**
     * Gathers the changes from the form state and calls the onSave callback.
     */
    const handleSave = () => {
        // Construct an `updates` object containing only the fields the user has chosen to change.
        const updates: { status?: Status; army?: string; gameSystem?: string, notes?: string } = {};
        if (status) {
            updates.status = status;
        }
        if (army.trim()) {
            updates.army = army.trim();
        }
        if (gameSystem) {
            updates.gameSystem = gameSystem;
        }
        if (updateNotes) {
            updates.notes = notes;
        }

        // Only call the save function if at least one field has been changed.
        if (Object.keys(updates).length > 0) {
            onSave(updates);
        } else {
            onClose(); // If no changes, just close the modal.
        }
    };

    return (
        <Modal onClose={onClose} title={`Bulk Edit ${selectedCount} Item${selectedCount > 1 ? 's' : ''}`} theme={theme}>
            <div className="p-6 space-y-6 text-gray-300">
                <p>Apply changes to all selected miniatures. Leave a field blank to keep its original value.</p>
                {/* Game System Field */}
                <div>
                    <label htmlFor="bulk-gameSystem" className="block text-sm font-medium text-gray-300">New Game System</label>
                    <select
                        id="bulk-gameSystem"
                        value={gameSystem}
                        onChange={(e) => setGameSystem(e.target.value)}
                        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                    >
                        <option value="">-- No Change --</option>
                        {allGameSystems.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                    </select>
                </div>
                {/* Army/Faction Field */}
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
                {/* Status Field */}
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
                {/* Notes Field */}
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
                        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing} ${!updateNotes ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>
            </div>
            {/* Modal Actions */}
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
