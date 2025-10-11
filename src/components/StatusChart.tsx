import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Miniature } from '../types';
import { STATUS_COLORS } from '../constants';

interface StatusChartProps {
    data: Miniature[];
}

const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
    const chartData = useMemo(() => {
        const statusCounts: { [key: string]: number } = {};

        data.forEach(miniature => {
            statusCounts[miniature.status] = (statusCounts[miniature.status] || 0) + miniature.modelCount;
        });

        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [data]);

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data for chart.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)',
                        borderColor: '#4b5563',
                        borderRadius: '0.5rem' 
                    }} 
                    cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                />
                <Legend iconType="circle" />
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={true}
                >
                    {chartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default StatusChart;