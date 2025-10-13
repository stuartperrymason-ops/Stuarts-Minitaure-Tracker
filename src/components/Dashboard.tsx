/**
 * @file src/components/Dashboard.tsx
 * This component renders the main dashboard view, displaying key statistics and charts
 * to give an overview of the user's miniature collection and hobby progress.
 */

import React, { useMemo } from 'react';
import { Miniature } from '../types';
import StatusChart from './StatusChart';
import Card from './Card';
import { CollectionIcon, CheckCircleIcon, ClockIcon, ListBulletIcon } from './Icons';
import { Theme } from '../themes';
import CombinedStatusTracker from './CombinedStatusTracker';

// Defines the props that the Dashboard component expects.
interface DashboardProps {
    miniatures: Miniature[]; // An array of all miniatures to be displayed/analyzed.
    theme: Theme; // The currently active theme object for styling.
}

/**
 * The Dashboard component.
 * @param {DashboardProps} props The properties passed to the component.
 * @returns {JSX.Element} The rendered dashboard UI.
 */
const Dashboard: React.FC<DashboardProps> = ({ miniatures, theme }) => {
    // `useMemo` is a React Hook that memoizes the result of a calculation.
    // It will only re-calculate the `stats` object if the `miniatures` array changes.
    // This prevents expensive calculations on every re-render, improving performance.
    const stats = useMemo(() => {
        const totalUnits = miniatures.length; // A "unit" is a single entry/row in the collection.
        // `reduce` is an array method to calculate a single value from an array.
        // Here, it sums up the `modelCount` of all miniatures to get the total model count.
        const totalModels = miniatures.reduce((sum, m) => sum + m.modelCount, 0);
        
        const paintedModels = miniatures
            // Filter the array to only include miniatures with a "painted" or "completed" status.
            .filter(m => ['Painted', 'Based', 'Ready for Game'].includes(m.status))
            // Then, reduce the filtered array to sum up their model counts.
            .reduce((sum, m) => sum + m.modelCount, 0);
            
        const unpaintedModels = totalModels - paintedModels;
        
        return { totalUnits, totalModels, paintedModels, unpaintedModels };
    }, [miniatures]); // The dependency array: this calculation runs only when `miniatures` changes.

    return (
        <div className="bg-gray-800/50 rounded-xl shadow-2xl p-6 backdrop-blur-sm">
            <h2 className={`text-3xl font-bold ${theme.primaryText} mb-6 tracking-wider transition-colors duration-300`}>Dashboard</h2>
            
            {/* Renders the main statistics cards. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                {/* Each Card is a reusable component that receives a title, value, icon, and theme. */}
                <Card title="Total Units" value={stats.totalUnits} icon={<ListBulletIcon />} theme={theme} />
                <Card title="Total Models" value={stats.totalModels} icon={<CollectionIcon className="h-8 w-8" />} theme={theme} />
                <Card title="Painted Models" value={stats.paintedModels} icon={<CheckCircleIcon />} theme={theme} />
                <Card title="Models to Paint" value={stats.unpaintedModels} icon={<ClockIcon />} theme={theme} />
            </div>
            
            {/* Renders the main chart and progress bar section. */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                <div className="lg:col-span-3 bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col justify-center">
                    {/* The CombinedStatusTracker component displays the overall progress bar. */}
                    <CombinedStatusTracker miniatures={miniatures} theme={theme} />
                </div>
                <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg shadow-inner">
                     <h3 className={`text-xl font-semibold ${theme.secondaryText} mb-4 transition-colors duration-300`}>Status Breakdown</h3>
                    {/* The StatusChart component displays a pie chart of the collection by status. */}
                    <StatusChart data={miniatures} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
