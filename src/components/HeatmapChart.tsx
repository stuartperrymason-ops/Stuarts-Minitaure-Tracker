import React from 'react';

const HeatmapChart: React.FC<{ data: any[] }> = ({ data }) => {
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data to display.</div>;
    }
    
    return (
        <div className="flex items-center justify-center h-[400px] w-full bg-gray-900/30 rounded-md">
            <p className="text-gray-400">Heatmap visualization is currently unavailable.</p>
        </div>
    );
};

export default HeatmapChart;
