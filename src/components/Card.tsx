/**
 * @file src/components/Card.tsx
 * A reusable UI component for displaying a single statistic on the dashboard.
 */

import React from 'react';
import { Theme } from '../themes';

// Defines the props (properties) the Card component will accept.
interface CardProps {
    title: string; // The label for the statistic (e.g., "Total Models").
    value: number | string; // The value of the statistic to display.
    icon: React.ReactNode; // A React component (like an SVG icon) to display alongside the stat.
    theme: Theme; // The active theme object for styling.
}

/**
 * A presentational component that displays a title, a value, and an icon in a styled card.
 * @param {CardProps} props The properties passed to the component.
 * @returns {JSX.Element} The rendered card element.
 */
const Card: React.FC<CardProps> = ({ title, value, icon, theme }) => {
    return (
        <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner flex items-center justify-between transition-all duration-300 hover:bg-gray-700/50 border border-transparent hover:border-cyan-500">
            <div>
                <p className="text-sm font-medium text-gray-400 uppercase">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className={`${theme.primaryText} transition-colors duration-300`}>
                {icon}
            </div>
        </div>
    );
};

export default Card;
