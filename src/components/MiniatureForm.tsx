/**
 * @file src/components/MiniatureForm.tsx
 * This component provides a form for adding a new miniature or editing an existing one.
 * It now connects to the Zustand store to manage its state and actions.
 */

import React, { useState, useEffect } from 'react';
import { Miniature, Status } from '../types';
import { useAppStore } from '../store';
import { STATUSES } from '../constants';

// The form now receives fewer props, as it gets most of its context from the store.
interface MiniatureFormProps {
    onSubmit: (miniature: Omit<Miniature, 'id'> | Miniature) => void;
    initialData?: Miniature | null;
    onCancel: () => void;
}

/**
 * A form for creating and editing miniatures.
 * @returns {JSX.Element} The rendered form.
 */
const MiniatureForm: React.FC<MiniatureFormProps> = ({ onSubmit, initialData, onCancel }) => {
    // Select necessary state from the store.
    const { gameSystems: allGameSystems, activeTheme } = useAppStore();
    
    // `useState` manages the form's local data.
    const [formData, setFormData] = useState({
        modelName: '',
        gameSystem: allGameSystems[0] || '',
        army: '',
        status: STATUSES[0],
        modelCount: 1,
        notes: '',
    });

    // `useEffect` populates the form when editing an existing miniature.
    useEffect(() => {
        if (initialData) {
            setFormData({
                modelName: initialData.modelName,
                gameSystem: initialData.gameSystem,
                army: initialData.army,
                status: initialData.status,
                modelCount: initialData.modelCount,
                notes: initialData.notes || '',
            });
        } else {
            // Reset form for adding a new entry.
            setFormData({
                modelName: '',
                gameSystem: allGameSystems[0] || '',
                army: '',
                status: STATUSES[0],
                modelCount: 1,
                notes: '',
            });
        }
    }, [initialData, allGameSystems]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'modelCount' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSubmit({ ...initialData, ...formData });
        } else {
            onSubmit(formData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-6 mb-8 bg-gray-900/50 rounded-lg space-y-6 border border-gray-700">
            <h3 className={`text-2xl font-semibold ${activeTheme.secondaryText} border-b border-gray-700 pb-3`}>{initialData ? 'Edit Miniature' : 'Add New Miniature'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-300">Model/Unit Name</label>
                    <input type="text" name="modelName" id="modelName" value={formData.modelName} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`} />
                </div>
                 <div>
                    <label htmlFor="gameSystem" className="block text-sm font-medium text-gray-300">Game System</label>
                    <select name="gameSystem" id="gameSystem" value={formData.gameSystem} onChange={handleChange} className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}>
                        {allGameSystems.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="army" className="block text-sm font-medium text-gray-300">Army / Faction</label>
                    <input type="text" name="army" id="army" value={formData.army} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`} />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="modelCount" className="block text-sm font-medium text-gray-300">Model Count</label>
                    <input type="number" name="modelCount" id="modelCount" min="1" value={formData.modelCount} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`} />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes</label>
                    <textarea name="notes" id="notes" rows={4} value={formData.notes} onChange={handleChange} placeholder="Add paint recipes, lore, or other notes..." className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}></textarea>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors">Cancel</button>
                <button type="submit" className={`px-6 py-2 ${activeTheme.button} text-white font-semibold rounded-lg shadow-md transition-colors`}>{initialData ? 'Update' : 'Save'}</button>
            </div>
        </form>
    );
};

export default MiniatureForm;