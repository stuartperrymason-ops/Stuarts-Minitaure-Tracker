import React, { useMemo } from 'react';
import { Miniature, Status } from '../types';
import { Theme } from '../themes';

interface CombinedStatusTrackerProps {
    miniatures: Miniature[];
    theme: Theme;
}

const statusGroups = [
    { name: 'Acquired', statuses: [Status.Purchased, Status.Printed], color: 'bg-red-500', label: 'Purchased/Printed' },
    { name: 'Prepped', statuses: [Status.Assembled, Status.Primed], color: 'bg-orange-500', label: 'Assembled/Primed' },
    { name: 'In Progress', statuses: [Status.Painted, Status.Based], color: 'bg-yellow-500', label: 'Painted/Based' },
    { name: 'Game Ready', statuses: [Status.ReadyForGame], color: 'bg-green-500', label: 'Ready for Game' }
];

const CombinedStatusTracker: React.FC<CombinedStatusTrackerProps> = ({ miniatures, theme }) => {
    const { totalModels, segments } = useMemo(() => {
        const totalModels = miniatures.reduce((sum, m) => sum + m.modelCount, 0);

        if (totalModels === 0) {
            return { totalModels: 0, segments: [] };
        }

        const calculatedSegments = statusGroups.map(group => {
            const count = miniatures
                .filter(m => group.statuses.includes(m.status))
                .reduce((sum, m) => sum + m.modelCount, 0);
            return {
                ...group,
                count,
                percentage: (count / totalModels) * 100
            };
        }).filter(segment => segment.count > 0);

        return { totalModels, segments: calculatedSegments };
    }, [miniatures]);

    if (totalModels === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                <h3 className={`text-xl font-semibold ${theme.secondaryText} mb-4 transition-colors duration-300 w-full`}>Overall Hobby Progress</h3>
                <p>No data to display. Add some miniatures!</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h3 className={`text-xl font-semibold ${theme.secondaryText} mb-4 transition-colors duration-300`}>Overall Hobby Progress ({totalModels} Models)</h3>

            <div className="flex w-full h-8 bg-gray-700 rounded-full overflow-hidden shadow-inner mb-4" role="progressbar" aria-valuemin={0} aria-valuemax={totalModels}>
                {segments.map((segment) => (
                    <div
                        key={segment.name}
                        className={`flex items-center justify-center ${segment.color} transition-all duration-500 ease-out`}
                        style={{ width: `${segment.percentage}%` }}
                        title={`${segment.name}: ${segment.count} models (${segment.percentage.toFixed(1)}%)`}
                    >
                        <span className="text-white text-xs font-bold truncate px-2">
                           {segment.percentage > 5 ? `${segment.count}`: ''}
                        </span>
                    </div>
                ))}
            </div>

            <div className={`flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm ${theme.legendText}`}>
                {segments.map((segment) => (
                    <div key={segment.name} className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded-full ${segment.color}`}></span>
                        <span>{segment.label}: <strong>{segment.count}</strong> ({segment.percentage.toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CombinedStatusTracker;
