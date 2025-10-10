import React, { useState, useEffect, useMemo } from 'react';
import { Miniature } from '../types';
import { GAME_SYSTEMS, STATUSES } from '../constants';
import { Theme } from '../themes';

interface MiniatureFormProps {
    onSubmit: (miniature: Omit<Miniature, 'id'> | Miniature) => void;
    initialData?: Miniature | null;
    onCancel: () => void;
    theme: Theme;
}

const MiniatureForm: React.FC<MiniatureFormProps> = ({ onSubmit, initialData, onCancel, theme }) => {
    const [formData, setFormData] = useState({
        modelName: '',
        gameSystem: GAME_SYSTEMS[0],
        army: '',
        status: STATUSES[0],
        modelCount: 1,
    });
    const [errors, setErrors] = useState({
        modelName: '',
        army: '',
        modelCount: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                modelName: initialData.modelName,
                gameSystem: initialData.gameSystem,
                army: initialData.army,
                status: initialData.status,
                modelCount: initialData.modelCount,
            });
        } else {
            setFormData({
                modelName: '',
                gameSystem: GAME_SYSTEMS[0],
                army: '',
                status: STATUSES[0],
                modelCount: 1,
            });
        }
        // Reset errors when initial data changes
        setErrors({ modelName: '', army: '', modelCount: '' });
    }, [initialData]);

    const validateField = (name: string, value: any) => {
        let error = '';
        switch (name) {
            case 'modelName':
                if (!value || value.trim() === '') {
                    error = 'Model name cannot be empty.';
                }
                break;
            case 'army':
                if (!value || value.trim() === '') {
                    error = 'Army / Faction cannot be empty.';
                }
                break;
            case 'modelCount':
                const count = Number(value);
                if (!Number.isInteger(count) || count < 1) {
                    error = 'Model count must be a positive number.';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'modelCount' ? parseInt(value) || 0 : value;
        
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, parsedValue) }));
    };
    
    const isFormValid = useMemo(() => {
        return (
            formData.modelName.trim() !== '' &&
            formData.army.trim() !== '' &&
            Number.isInteger(formData.modelCount) &&
            formData.modelCount >= 1
        );
    }, [formData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Final validation check on submit
        const modelNameError = validateField('modelName', formData.modelName);
        const armyError = validateField('army', formData.army);
        const modelCountError = validateField('modelCount', formData.modelCount);

        if (modelNameError || armyError || modelCountError) {
            setErrors({
                modelName: modelNameError,
                army: armyError,
                modelCount: modelCountError,
            });
            return;
        }

        if (initialData) {
            onSubmit({ ...initialData, ...formData });
        } else {
            onSubmit(formData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-300 mb-1">Model/Unit Name</label>
                    <input type="text" name="modelName" id="modelName" value={formData.modelName} onChange={handleChange} required className={`block w-full bg-gray-700 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${errors.modelName ? theme.errorRing : `border-gray-600 ${theme.accentRing}`}`} />
                    {errors.modelName && <p className={`${theme.errorText} text-xs mt-1`}>{errors.modelName}</p>}
                </div>
                 <div>
                    <label htmlFor="gameSystem" className="block text-sm font-medium text-gray-300 mb-1">Game System</label>
                    <select name="gameSystem" id="gameSystem" value={formData.gameSystem} onChange={handleChange} className={`block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}>
                        {GAME_SYSTEMS.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="army" className="block text-sm font-medium text-gray-300 mb-1">Army / Faction</label>
                    <input type="text" name="army" id="army" value={formData.army} onChange={handleChange} required className={`block w-full bg-gray-700 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${errors.army ? theme.errorRing : `border-gray-600 ${theme.accentRing}`}`} />
                    {errors.army && <p className={`${theme.errorText} text-xs mt-1`}>{errors.army}</p>}
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className={`block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="modelCount" className="block text-sm font-medium text-gray-300 mb-1">Model Count</label>
                    <input type="number" name="modelCount" id="modelCount" min="1" value={formData.modelCount} onChange={handleChange} required className={`block w-full bg-gray-700 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${errors.modelCount ? theme.errorRing : `border-gray-600 ${theme.accentRing}`}`} />
                    {errors.modelCount && <p className={`${theme.errorText} text-xs mt-1`}>{errors.modelCount}</p>}
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors">Cancel</button>
                <button type="submit" disabled={!isFormValid} className={`px-6 py-2 ${theme.button} text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500`}>{initialData ? 'Update Miniature' : 'Add Miniature'}</button>
            </div>
        </form>
    );
};

export default MiniatureForm;