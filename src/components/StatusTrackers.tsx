import React, { useMemo } from 'react';
import { Miniature, Status } from '../types';

interface StatusTrackersProps {
    miniatures: Miniature[];
}

interface TrackerBarProps {
    label: string;
    count: number;
    total: number;
    colorClass: string;
}

const TrackerBar: React.FC<TrackerBarProps> = ({ label, count, total, colorClass }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className="text-sm font-medium text-gray-400">{count} / {total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                    className={`${colorClass} h-4 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={count}
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-label={label}
                ></div>
            </div>
        </div>
    );
};

const StatusTrackers: React.FC<StatusTrackersProps> = ({ miniatures }) => {
    const { totalModels, redCount, orangeCount, yellowCount, greenCount } = useMemo(() => {
        const totalModels = miniatures.reduce((sum, m) => sum + m.modelCount, 0);

        const redCount = miniatures
            .filter(m => m.status === Status.Purchased || m.status === Status.Printed)
            .reduce((sum, m) => sum + m.modelCount, 0);

        const orangeCount = miniatures
            .filter(m => m.status === Status.Assembled || m.status === Status.Primed)
            .reduce((sum, m) => sum + m.modelCount, 0);

        const yellowCount = miniatures
            .filter(m => m.status === Status.Painted || m.status === Status.Based)
            .reduce((sum, m) => sum + m.modelCount, 0);

        const greenCount = miniatures
            .filter(m => m.status === Status.ReadyForGame)
            .reduce((sum, m) => sum + m.modelCount, 0);

        return { totalModels, redCount, orangeCount, yellowCount, greenCount };
    }, [miniatures]);

    if (miniatures.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data to display. Add some miniatures!</div>;
    }

    return (
        <div className="space-y-6">
            <TrackerBar
                label="Acquired (Purchased/Printed)"
                count={redCount}
                total={totalModels}
                colorClass="bg-red-500"
            />
            <TrackerBar
                label="Prepped (Assembled/Primed)"
                count={orangeCount}
                total={totalModels}
                colorClass="bg-orange-500"
            />
            <TrackerBar
                label="Hobby Progress (Painted/Based)"
                count={yellowCount}
                total={totalModels}
                colorClass="bg-yellow-500"
            />
            <TrackerBar
                label="Game Ready"
                count={greenCount}
                total={totalModels}
                colorClass="bg-green-500"
            />
        </div>
    );
};

export default StatusTrackers;