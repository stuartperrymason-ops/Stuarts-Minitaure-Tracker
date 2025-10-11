import React from 'react';
import { Theme } from '../themes';

interface CardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    theme: Theme;
}

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