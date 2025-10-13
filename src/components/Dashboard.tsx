import React, { useMemo } from 'react';
import { Miniature } from '../types';
import StatusChart from './StatusChart';
import Card from './Card';
// FIX: Import ListBulletIcon which was missing.
import { CollectionIcon, CheckCircleIcon, ClockIcon, ListBulletIcon } from './Icons';
import { Theme } from '../themes';
import CombinedStatusTracker from './CombinedStatusTracker';

interface DashboardProps {
    miniatures: Miniature[];
    theme: Theme;
}

const Dashboard: React.FC<DashboardProps> = ({ miniatures, theme }) => {
    const stats = useMemo(() => {
        const totalUnits = miniatures.length;
        const totalModels = miniatures.reduce((sum, m) => sum + m.modelCount, 0);
        const paintedModels = miniatures
            .filter(m => ['Painted', 'Based', 'Ready for Game'].includes(m.status))
            .reduce((sum, m) => sum + m.modelCount, 0);
        const unpaintedModels = totalModels - paintedModels;
        
        return { totalUnits, totalModels, paintedModels, unpaintedModels };
    }, [miniatures]);

    return (
        <div className="bg-gray-800/50 rounded-xl shadow-2xl p-6 backdrop-blur-sm">
            <h2 className={`text-3xl font-bold ${theme.primaryText} mb-6 tracking-wider transition-colors duration-300`}>Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                <Card title="Total Units" value={stats.totalUnits} icon={<ListBulletIcon />} theme={theme} />
                {/* FIX: The CollectionIcon component was updated to accept a className to allow resizing. */}
                <Card title="Total Models" value={stats.totalModels} icon={<CollectionIcon className="h-8 w-8" />} theme={theme} />
                <Card title="Painted Models" value={stats.paintedModels} icon={<CheckCircleIcon />} theme={theme} />
                <Card title="Models to Paint" value={stats.unpaintedModels} icon={<ClockIcon />} theme={theme} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                <div className="lg:col-span-3 bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col justify-center">
                    <CombinedStatusTracker miniatures={miniatures} theme={theme} />
                </div>
                <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg shadow-inner">
                     <h3 className={`text-xl font-semibold ${theme.secondaryText} mb-4 transition-colors duration-300`}>Status Breakdown</h3>
                    <StatusChart data={miniatures} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
