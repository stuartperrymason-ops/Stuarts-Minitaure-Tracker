/**
 * @file src/components/MiniatureForm.tsx
 * This component provides a form for adding a new miniature or editing an existing one.
 */

import React, { useState, useEffect } from 'react';
import { Miniature, Status } from '../types';
import { STATUSES } from '../constants';
import { Theme } from '../themes';

// Defines the props expected by the MiniatureForm component.
interface MiniatureFormProps {
    onSubmit: (miniature: Omit<Miniature, 'id'> | Miniature) => void; // Callback function executed on form submission.
    initialData?: Miniature | null; // Optional data for an existing miniature to pre-fill the form for editing.
    onCancel: () => void; // Callback function to cancel the form and hide it.
    theme: Theme; // The active theme for styling.
    allGameSystems: string[]; // List of all available game systems for the dropdown.
}

/**
 * A form for creating and editing miniatures.
 * @param {MiniatureFormProps} props The properties passed to the component.
 * @returns {JSX.Element} The rendered form.
 */
const MiniatureForm: React.FC<MiniatureFormProps> = ({ onSubmit, initialData, onCancel, theme, allGameSystems }) => {
    // `useState` manages the form's data. It's a single object containing all field values.
    const [formData, setFormData] = useState({
        modelName: '',
        gameSystem: allGameSystems[0] || '', // Default to the first game system or an empty string.
        army: '',
        status: STATUSES[0], // Default to the first status.
        modelCount: 1,
        notes: '',
    });

    // `useEffect` is used to react to changes in props.
    // This effect runs whenever `initialData` or `allGameSystems` changes.
    useEffect(() => {
        // If `initialData` is provided, it means we are editing. Populate the form with this data.
        if (initialData) {
            setFormData({
                modelName: initialData.modelName,
                gameSystem: initialData.gameSystem,
                army: initialData.army,
                status: initialData.status,
                modelCount: initialData.modelCount,
                notes: initialData.notes || '', // Handle cases where notes might be undefined.
            });
        } else {
            // If `initialData` is null, it means we are adding a new miniature. Reset the form to default values.
            setFormData({
                modelName: '',
                gameSystem: allGameSystems[0] || '',
                army: '',
                status: STATUSES[0],
                modelCount: 1,
                notes: '',
            });
        }
    }, [initialData, allGameSystems]); // The dependency array for this effect.

    /**
     * A generic change handler for all form inputs.
     * It updates the `formData` state object based on the input's `name` attribute.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e The input change event.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'modelCount' ? parseInt(value) || 0 : value }));
    };

    /**
     * Handles the form submission event.
     * @param {React.FormEvent} e The form submission event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default browser behavior of a full-page reload.
        if (initialData) {
            // If we were editing, combine the initial data with the new form data.
            // This ensures the `id` is preserved.
            onSubmit({ ...initialData, ...formData });
        } else {
            // If adding a new miniature, just submit the current form data.
            onSubmit(formData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-6 mb-8 bg-gray-900/50 rounded-lg space-y-6 border border-gray-700">
            <h3 className={`text-2xl font-semibold ${theme.secondaryText} border-b border-gray-700 pb-3`}>{initialData ? 'Edit Miniature' : 'Add New Miniature'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Model Name Input */}
                <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-300">Model/Unit Name</label>
                    <input type="text" name="modelName" id="modelName" value={formData.modelName} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`} />
                </div>
                {/* Game System Dropdown */}
                 <div>
                    <label htmlFor="gameSystem" className="block text-sm font-medium text-gray-300">Game System</label>
                    <select name="gameSystem" id="gameSystem" value={formData.gameSystem} onChange={handleChange} className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}>
                        {allGameSystems.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                    </select>
                </div>
                {/* Army/Faction Input */}
                 <div>
                    <label htmlFor="army" className="block text-sm font-medium text-gray-300">Army / Faction</label>
                    <input type="text" name="army" id="army" value={formData.army} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`} />
                </div>
                {/* Status Dropdown */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                {/* Model Count Input */}
                 <div>
                    <label htmlFor="modelCount" className="block text-sm font-medium text-gray-300">Model Count</label>
                    <input type="number" name="modelCount" id="modelCount" min="1" value={formData.modelCount} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`} />
                </div>
                {/* Notes Text Area */}
                <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes</label>
                    <textarea name="notes" id="notes" rows={4} value={formData.notes} onChange={handleChange} placeholder="Add paint recipes, lore, or other notes..." className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}></textarea>
                </div>
            </div>
            {/* Form Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors">Cancel</button>
                <button type="submit" className={`px-6 py-2 ${theme.button} text-white font-semibold rounded-lg shadow-md transition-colors`}>{initialData ? 'Update' : 'Save'}</button>
            </div>
        </form>
    );
};

export default MiniatureForm;
