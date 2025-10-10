import React from 'react';
import { Miniature, Filter, GameSystem } from '../types';
import { GAME_SYSTEMS } from '../constants';
import { Theme } from '../themes';

interface FilterControlsProps {
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    allMiniatures: Miniature[];
    theme: Theme;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters, allMiniatures, theme }) => {
    const armyOptions = React.useMemo(() => {
        const armies = new Set(allMiniatures.map(m => m.army));
        return Array.from(armies).sort();
    }, [allMiniatures]);

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg">
            <div className="flex-1">
                <label htmlFor="gameSystemFilter" className="block text-sm font-medium text-gray-400 mb-1">Game System</label>
                <select 
                    id="gameSystemFilter" 
                    value={filters.gameSystem} 
                    onChange={e => setFilters({...filters, gameSystem: e.target.value as GameSystem | 'all'})}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                >
                    <option value="all">All Systems</option>
                    {GAME_SYSTEMS.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                </select>
            </div>
            <div className="flex-1">
                <label htmlFor="armyFilter" className="block text-sm font-medium text-gray-400 mb-1">Army</label>
                <input 
                    type="text"
                    id="armyFilter"
                    list="army-options"
                    placeholder="Filter by army..."
                    value={filters.army}
                    onChange={e => setFilters({...filters, army: e.target.value})}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
                 <datalist id="army-options">
                    {armyOptions.map(army => <option key={army} value={army} />)}
                </datalist>
            </div>
        </div>
    );
};

export default FilterControls;