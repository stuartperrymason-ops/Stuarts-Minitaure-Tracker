/**
 * @file src/pages/SettingsPage.tsx
 * This component provides a user interface for managing application settings,
 * starting with the ability to add new game systems to the collection.
 */

import React, { useState } from 'react';
import { useAppStore } from '../store';

/**
 * The page component for managing settings.
 * @returns {JSX.Element} The rendered settings page.
 */
const SettingsPage: React.FC = () => {
    // Select necessary state and actions from the Zustand store.
    // FIX: Property 'allGameSystems' does not exist on type '{...}'. The property is named 'gameSystems' in the store, so we alias it.
    const { gameSystems: allGameSystems, addGameSystem, activeTheme } = useAppStore();

    // Local state for the form input field.
    const [newSystemName, setNewSystemName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    /**
     * Handles the form submission to add a new game system.
     * @param {React.FormEvent} e The form submission event.
     */
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSystemName.trim() || isAdding) return;

        setIsAdding(true);
        const success = await addGameSystem(newSystemName);
        setIsAdding(false);
        
        if (success) {
            setNewSystemName('');
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-sm animate-fade-in">
            <h2 className={`text-3xl font-bold ${activeTheme.primaryText} mb-6 tracking-wider border-b border-gray-700 pb-4`}>
                Settings
            </h2>
            <div className="mt-8 max-w-2xl mx-auto">
                <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner">
                    <h3 className={`text-xl font-semibold ${activeTheme.secondaryText} mb-4`}>Manage Game Systems</h3>
                    <p className="text-gray-400 mb-6">
                        Add new game systems to the list available throughout the application.
                    </p>
                    
                    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            value={newSystemName}
                            onChange={(e) => setNewSystemName(e.target.value)}
                            placeholder="e.g., Star Wars: X-Wing"
                            required
                            className={`flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}
                        />
                        <button
                            type="submit"
                            disabled={isAdding || !newSystemName.trim()}
                            className={`px-6 py-2 ${activeTheme.button} text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isAdding ? 'Adding...' : 'Add System'}
                        </button>
                    </form>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-300 mb-3">Current Systems:</h4>
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {allGameSystems.map(system => (
                                <li key={system} className="bg-gray-700/50 p-3 rounded-md text-gray-200">
                                    {system}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;