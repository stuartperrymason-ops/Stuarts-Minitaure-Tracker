import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Miniature, Status } from '../types';
import { STATUSES } from '../constants';
import { Theme } from '../themes';

interface MiniatureFormProps {
    onSubmit: (miniature: Omit<Miniature, '_id'> | Miniature) => void;
    initialData?: Miniature | null;
    onCancel: () => void;
    theme: Theme;
}

const MiniatureForm: React.FC<MiniatureFormProps> = ({ onSubmit, initialData, onCancel, theme }) => {
    const gameSystems = useAppStore(state => state.gameSystems);
    
    const [formData, setFormData] = useState({
        modelName: '',
        gameSystem: gameSystems[0] || '',
        army: '',
        status: STATUSES[0],
        modelCount: 1,
        notes: '',
    });

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
            setFormData({
                modelName: '',
                gameSystem: gameSystems[0] || '',
                army: '',
                status: STATUSES[0],
                modelCount: 1,
                notes: '',
            });
        }
    }, [initialData, gameSystems]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'modelCount' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.modelName.trim() === '' || formData.army.trim() === '') return;
        
        if (initialData) {
            onSubmit({ ...initialData, ...formData });
        } else {
            onSubmit(formData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-6 mb-8 bg-gray-900/50 rounded-lg space-y-6 border border-gray-700 animate-fade-in">
            <h3 className={`text-2xl font-semibold ${theme.secondaryText} border-b border-gray-700 pb-3`}>{initialData ? 'Edit Miniature' : 'Add New Miniature'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-300">Model/Unit Name</label>
                    <input type="text" name="modelName" id="modelName" value={formData.modelName} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`} />
                </div>
                 <div>
                    <label htmlFor="gameSystem" className="block text-sm font-medium text-gray-300">Game System</label>
                    <select name="gameSystem" id="gameSystem" value={formData.gameSystem} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}>
                        {gameSystems.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="army" className="block text-sm font-medium text-gray-300">Army / Faction</label>
                    <input type="text" name="army" id="army" value={formData.army} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`} />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="modelCount" className="block text-sm font-medium text-gray-300">Model Count</label>
                    <input type="number" name="modelCount" id="modelCount" min="1" value={formData.modelCount} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`} />
                </div>
                <div className="md:col-span-2">
                     <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes</label>
                    <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`} placeholder="e.g., paint scheme, squad markings..."/>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors">Cancel</button>
                <button type="submit" className={`px-6 py-2 ${theme.button} text-white font-semibold rounded-lg shadow-md transition-colors`}>{initialData ? 'Update' : 'Save'}</button>
            </div>
        </form>
    );
};

export default MiniatureForm;