/**
 * @file src/components/FilterControls.tsx
 * This component provides UI elements (dropdowns, text inputs) for filtering the main miniature list.
 */

import React from 'react';
import { Miniature, Filter } from '../types';
import { Theme } from '../themes';

// Defines the props that FilterControls expects.
interface FilterControlsProps {
    filters: Filter; // The current filter state object.
    setFilters: React.Dispatch<React.SetStateAction<Filter>>; // Function to update the filter state in the parent component.
    allMiniatures: Miniature[]; // The complete list of all miniatures, used to derive filter options.
    allGameSystems: string[]; // The complete list of all game systems.
    theme: Theme; // The active theme for styling.
}

/**
 * A component with controls to filter the miniature collection.
 * @param {FilterControlsProps} props The properties passed to the component.
 * @returns {JSX.Element} The rendered filter controls form.
 */
const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters, allMiniatures, allGameSystems, theme }) => {
    
    // `useMemo` calculates the list of unique army names.
    // This list is now dependent on the selected game system. It only shows armies
    // that exist within the currently filtered game system.
    // It recalculates only when `allMiniatures` or `filters.gameSystem` changes.
    const armyOptions = React.useMemo(() => {
        // Determine which miniatures to consider based on the game system filter.
        const relevantMiniatures = filters.gameSystem === 'all'
            ? allMiniatures // If 'All Systems' is selected, use the entire collection.
            : allMiniatures.filter(m => m.gameSystem === filters.gameSystem); // Otherwise, filter miniatures by the selected system.

        // A `Set` is used here to automatically handle uniqueness.
        const armies = new Set(relevantMiniatures.map(m => m.army));
        // Convert the Set back to an array and sort it alphabetically for the datalist suggestions.
        return Array.from(armies).sort();
    }, [allMiniatures, filters.gameSystem]); // The dependency array ensures this runs only when needed.

    /**
     * Handles changes to the game system dropdown.
     * When a new game system is selected, it resets the army filter to prevent
     * a situation where an invalid army is selected for the new system.
     * @param {React.ChangeEvent<HTMLSelectElement>} e The select change event.
     */
    const handleGameSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({
            gameSystem: e.target.value,
            army: '' // Reset the army filter to an empty string.
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
                    // When the value changes, call the dedicated handler.
                    onChange={handleGameSystemChange}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                >
                    <option value="all">All Systems</option>
                    {/* Map over the `allGameSystems` array to create an <option> for each one. */}
                    {allGameSystems.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                </select>
            </div>
            {/* Army Filter */}
            <div className="flex-1">
                <label htmlFor="armyFilter" className="block text-sm font-medium text-gray-400 mb-1">Army</label>
                <input 
                    type="text"
                    id="armyFilter"
                    list="army-options" // Links this input to the datalist below for autocomplete.
                    placeholder="Filter by army..."
                    value={filters.army}
                    // The spread operator `...filters` ensures we don't lose the gameSystem filter value.
                    onChange={e => setFilters({...filters, army: e.target.value})}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
                 {/* The datalist provides suggestions but allows the user to type any value. */}
                 <datalist id="army-options">
                    {armyOptions.map(army => <option key={army} value={army} />)}
                </datalist>
            </div>
        </div>
    );
};

export default FilterControls;