/**
 * @file src/components/MiniatureForm.tsx
 * This component provides a form for adding a new miniature or editing an existing one.
 * It's designed to be displayed inside a modal and now includes image upload functionality.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Miniature } from '../types';
import { useAppStore } from '../store';
import { STATUSES } from '../constants';
import { UploadIcon, XIcon } from './Icons';

// Defines the props for the MiniatureForm component.
interface MiniatureFormProps {
    onSubmit: (miniature: Omit<Miniature, '_id'> | Miniature) => void;
    initialData?: Miniature | null; // Data for editing an existing miniature.
    onClose: () => void; // Function to close the modal containing the form.
}

/**
 * A form for creating and updating miniature entries with image upload support.
 * @param {MiniatureFormProps} props The component's properties.
 * @returns {JSX.Element} The rendered form.
 */
const MiniatureForm: React.FC<MiniatureFormProps> = ({ onSubmit, initialData, onClose }) => {
    // Select necessary state from the Zustand store.
    const { gameSystems: allGameSystems, activeTheme } = useAppStore();

    // The form's state is managed locally within this component.
    const [formData, setFormData] = useState({
        modelName: '',
        gameSystem: allGameSystems.length > 0 ? allGameSystems[0] : '',
        army: '',
        status: STATUSES[0],
        modelCount: 1,
        notes: '',
    });
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // `useEffect` populates the form with `initialData` when editing a miniature.
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
            setExistingImages(initialData.images || []);
        }
    }, [initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImageFile = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.gameSystem) {
            alert("Please select a game system.");
            return;
        }
        setIsUploading(true);

        let uploadedImageUrls: string[] = [];
        if (newImageFiles.length > 0) {
            const uploadFormData = new FormData();
            newImageFiles.forEach(file => {
                uploadFormData.append('images', file);
            });

            try {
                const response = await axios.post('/api/upload', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploadedImageUrls = response.data.urls;
            } catch (error) {
                console.error('Image upload failed:', error);
                alert('Image upload failed. Please try again.');
                setIsUploading(false);
                return;
            }
        }
        
        const finalImages = [...existingImages, ...uploadedImageUrls];
        const finalMiniatureData = { ...formData, images: finalImages };

        if (initialData) {
            onSubmit({ ...initialData, ...finalMiniatureData });
        } else {
            onSubmit(finalMiniatureData);
        }
        setIsUploading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'modelCount' ? parseInt(value) || 1 : value }));
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form fields */}
                    <div>
                        <label htmlFor="modelName" className="block text-sm font-medium text-gray-300">Model/Unit Name</label>
                        <input type="text" name="modelName" id="modelName" value={formData.modelName} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`} />
                    </div>
                     <div>
                        <label htmlFor="gameSystem" className="block text-sm font-medium text-gray-300">Game System</label>
                        <select name="gameSystem" id="gameSystem" value={formData.gameSystem} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}>
                            {allGameSystems.length === 0 && <option disabled>Loading systems...</option>}
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
                     <div className="md:col-span-2">
                        <label htmlFor="modelCount" className="block text-sm font-medium text-gray-300">Model Count</label>
                        <input type="number" name="modelCount" id="modelCount" min="1" value={formData.modelCount} onChange={handleChange} required className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`} />
                    </div>
                    <div className="md:col-span-2">
                         <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes</label>
                        <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}></textarea>
                    </div>

                    {/* Image Upload Section */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300">Images</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadIcon />
                                <div className="flex text-sm text-gray-400">
                                    <label htmlFor="file-upload" className={`relative cursor-pointer bg-gray-800 rounded-md font-medium ${activeTheme.primaryText} hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 ${activeTheme.accentRing}`}>
                                        <span>Upload files</span>
                                        <input id="file-upload" name="images" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Image Previews */}
                    {(existingImages.length > 0 || newImageFiles.length > 0) && (
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-300 mb-2">Image Previews</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {existingImages.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img src={url} alt={`Existing image ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                        <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <XIcon />
                                        </button>
                                    </div>
                                ))}
                                {newImageFiles.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <img src={URL.createObjectURL(file)} alt={`New image ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                        <button type="button" onClick={() => removeNewImageFile(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <XIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
             <div className="flex justify-end gap-4 p-4 bg-gray-700/50">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors">Cancel</button>
                <button type="submit" disabled={isUploading} className={`px-6 py-2 ${activeTheme.button} text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50`}>
                    {isUploading ? 'Saving...' : (initialData ? 'Update Miniature' : 'Add Miniature')}
                </button>
            </div>
        </form>
    );
};

export default MiniatureForm;