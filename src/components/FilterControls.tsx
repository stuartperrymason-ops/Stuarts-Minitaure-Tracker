/**
 * @file src/components/FilterControls.tsx
 * This component provides UI elements for filtering the main miniature list.
 * It connects to the Zustand store to manage its state.
 */

import React from 'react';
import { useAppStore } from '../store';

/**
 * A component with controls to filter the miniature collection.
 * It is now self-contained and gets all necessary data and functions from the store.
 * @returns {JSX.Element} The rendered filter controls form.
 */
const FilterControls: React.FC = () => {
    // Select all necessary state and actions from the store.
    const { 
        filters, 
        setFilters, 
        miniatures: allMiniatures, 
        gameSystems: allGameSystems, 
        activeTheme 
    } = useAppStore();
    
    // `useMemo` calculates the list of unique army names based on the selected game system.
    const armyOptions = React.useMemo(() => {
        const relevantMiniatures = filters.gameSystem === 'all'
            ? allMiniatures
            : allMiniatures.filter(m => m.gameSystem === filters.gameSystem);
        const armies = new Set(relevantMiniatures.map(m => m.army));
        // FIX: Replaced `Array.from` with spread syntax for better type inference to resolve 'type unknown' error.
        return [...armies].sort();
    }, [allMiniatures, filters.gameSystem]);

    /**
     * Handles changes to the game system dropdown, resetting the army filter.
     */
    const handleGameSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({
            gameSystem: e.target.value,
            army: '' // Reset the army filter.
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg">
            {/* Game System Filter */}
            <div className="flex-1">
                <label htmlFor="gameSystemFilter" className="block text-sm font-medium text-gray-400 mb-1">Game System</label>
                <select 
                    id="gameSystemFilter" 
                    value={filters.gameSystem} 
                    onChange={handleGameSystemChange}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}
                >
                    <option value="all">All Systems</option>
                    {allGameSystems.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                </select>
            </div>
            {/* Army Filter */}
            <div className="flex-1">
                <label htmlFor="armyFilter" className="block text-sm font-medium text-gray-400 mb-1">Army</label>
                <input 
                    type="text"
                    id="armyFilter"
                    list="army-options"
                    placeholder="Filter by army..."
                    value={filters.army}
                    onChange={e => setFilters({ army: e.target.value })}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${activeTheme.accentRing}`}
                />
                 <datalist id="army-options">
                    {armyOptions.map(army => <option key={army} value={army} />)}
                </datalist>
            </div>
        </div>
    );
};

export default FilterControls;