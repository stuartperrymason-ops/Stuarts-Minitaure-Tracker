/**
 * @file src/components/StatusChart.tsx
 * This component visualizes the distribution of miniatures by their hobby status using a pie chart.
 */

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Miniature } from '../types';
import { STATUS_COLORS } from '../constants';

// Defines the props for the StatusChart component.
interface StatusChartProps {
    data: Miniature[]; // The array of miniatures to visualize.
}

/**
 * A pie chart component that shows the breakdown of the collection by status.
 * @param {StatusChartProps} props The properties passed to the component.
 * @returns {JSX.Element} A responsive pie chart.
 */
const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
    // `useMemo` is used to process the raw miniature data into the format required by the charting library.
    // This calculation is memoized and only re-runs if the `data` prop changes.
    const chartData = useMemo(() => {
        // Create an object to hold the counts of models for each status.
        const statusCounts: { [key: string]: number } = {};

        // Iterate over each miniature to aggregate the model counts by status.
        data.forEach(miniature => {
            statusCounts[miniature.status] = (statusCounts[miniature.status] || 0) + miniature.modelCount;
        });

        // Convert the aggregated object into an array of objects, which is the format `recharts` expects.
        // e.g., { "Painted": 50, "Primed": 20 } becomes [{ name: "Painted", value: 50 }, { name: "Primed", value: 20 }]
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [data]);

    // If there is no data, display a placeholder message instead of an empty chart.
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data for chart.</div>;
    }

    return (
        // `ResponsiveContainer` makes the chart automatically resize to fit its parent container.
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                {/* `Tooltip` shows details when a user hovers over a chart segment. */}
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)',
                        borderColor: '#4b5563',
                        borderRadius: '0.5rem' 
                    }} 
                    cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                />
                {/* `Legend` displays the key for the chart's colors. */}
                <Legend iconType="circle" />
                <Pie
                    data={chartData}
                    cx="50%" // Center X
                    cy="50%" // Center Y
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value" // The property in `chartData` that determines the segment size.
                    nameKey="name" // The property used for the label in the tooltip and legend.
                    isAnimationActive={true}
                >
                    {/* Map over the data to create a `Cell` for each segment. */}
                    {/* Each cell is given a specific fill color from our constants file. */}
                    {chartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default StatusChart;
