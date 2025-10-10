import React, { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { Miniature } from '../types';
import { STATUS_COLORS, STATUS_PROGRESS } from '../constants';

interface HeatmapChartProps {
    data: Miniature[];
}

interface TreemapNode {
    name: string;
    size: number;
    statusProgress: number;
    children?: TreemapNode[];
    // FIX: Add optional gameSystem property to allow it on leaf nodes for the tooltip.
    gameSystem?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const { name, size, gameSystem } = payload[0].payload;
        return (
            <div className="bg-gray-800 text-white p-3 rounded-lg border border-gray-600 shadow-lg">
                <p className="font-bold">{name}</p>
                {gameSystem && <p className="text-sm text-gray-400">{gameSystem}</p>}
                <p className="text-sm">Model Count: {size}</p>
            </div>
        );
    }
    return null;
};


const HeatmapChart: React.FC<HeatmapChartProps> = ({ data }) => {
    const treemapData = useMemo(() => {
        const groupedByGameSystem: { [key: string]: TreemapNode } = {};

        data.forEach(mini => {
            if (!groupedByGameSystem[mini.gameSystem]) {
                groupedByGameSystem[mini.gameSystem] = {
                    name: mini.gameSystem,
                    size: 0,
                    statusProgress: 0,
                    children: [],
                };
            }

            const gameSystemNode = groupedByGameSystem[mini.gameSystem];
            
            const armyNode = gameSystemNode.children?.find(c => c.name === mini.army);

            if (armyNode) {
                armyNode.size += mini.modelCount;
                armyNode.statusProgress += STATUS_PROGRESS[mini.status] * mini.modelCount;
                armyNode.children?.push({
                    name: mini.modelName,
                    size: mini.modelCount,
                    statusProgress: STATUS_PROGRESS[mini.status],
                    gameSystem: mini.gameSystem, // Add for tooltip
                });
            } else {
                 gameSystemNode.children?.push({
                    name: mini.army,
                    size: mini.modelCount,
                    statusProgress: STATUS_PROGRESS[mini.status] * mini.modelCount,
                    children: [{
                        name: mini.modelName,
                        size: mini.modelCount,
                        statusProgress: STATUS_PROGRESS[mini.status],
                        gameSystem: mini.gameSystem, // Add for tooltip
                    }]
                });
            }
        });
        
        return Object.values(groupedByGameSystem);

    }, [data]);

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data to display. Add some miniatures!</div>;
    }

    const COLORS = Object.values(STATUS_COLORS);

    const CustomTreemapContent = (props: any) => {
        const { root, depth, x, y, width, height, index, payload, rank, name } = props;
        
        if (!payload || !payload.statusProgress || !payload.size) return null;
        
        const avgProgress = payload.statusProgress / payload.size;
        
        const colorIndex = Math.round(avgProgress) - 1;
        const color = COLORS[colorIndex] || '#374151';

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill: depth < 2 ? 'transparent' : color,
                        stroke: '#111827',
                        strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1,
                    }}
                />
                {depth === 1 && width > 80 && height > 20 ? (
                     <text x={x + 6} y={y + 18} fill="#fff" fontSize={14} fillOpacity={0.9}>
                        {name}
                    </text>
                ) : null}
                {depth === 2 && width * height > 1000 ? (
                    <text x={x + 4} y={y + 12} fill="#fff" fontSize={10} fillOpacity={0.7}>
                        {name}
                    </text>
                ) : null}
            </g>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <Treemap
                data={treemapData}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomTreemapContent />}
                isAnimationActive={true}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
        </ResponsiveContainer>
    );
};

export default HeatmapChart;
