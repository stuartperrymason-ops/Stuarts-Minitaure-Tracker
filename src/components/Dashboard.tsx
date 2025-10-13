import React, { useMemo } from 'react';
import { Miniature } from '../types';
import HeatmapChart from './HeatmapChart';
import StatusChart from './StatusChart';
import Card from './Card';
import { CollectionIcon, CheckCircleIcon, ClockIcon } from './Icons';

interface DashboardProps {
    miniatures: Miniature[];
}

const Dashboard: React.FC<DashboardProps> = ({ miniatures }) => {
    const stats = useMemo(() => {
        const totalModels = miniatures.reduce((sum, m) => sum + m.modelCount, 0);
        const paintedModels = miniatures
            .filter(m => ['Painted', 'Based', 'Ready for Game'].includes(m.status))
            .reduce((sum, m) => sum + m.modelCount, 0);
        const unpaintedModels = totalModels - paintedModels;
        
        return { totalModels, paintedModels, unpaintedModels };
    }, [miniatures]);

    return (
        <div className="bg-gray-800/50 rounded-xl shadow-2xl p-6 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 tracking-wider">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card title="Total Models" value={stats.totalModels} icon={<CollectionIcon />} />
                <Card title="Painted Models" value={stats.paintedModels} icon={<CheckCircleIcon />} />
                <Card title="Models to Paint" value={stats.unpaintedModels} icon={<ClockIcon />} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                <div className="lg:col-span-3 bg-gray-900/50 p-4 rounded-lg shadow-inner">
                     <h3 className="text-xl font-semibold text-purple-400 mb-4">Progress Heatmap</h3>
                    <HeatmapChart data={miniatures} />
                </div>
                <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg shadow-inner">
                     <h3 className="text-xl font-semibold text-purple-400 mb-4">Status Overview</h3>
                    <StatusChart data={miniatures} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;