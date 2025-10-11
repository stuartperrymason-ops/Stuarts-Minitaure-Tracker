import React from 'react';
import { Miniature } from '../types';
import Dashboard from '../components/Dashboard';
import { Theme } from '../themes';

interface DashboardPageProps {
    filteredMiniatures: Miniature[];
    theme: Theme;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ filteredMiniatures, theme }) => {
    return (
        <Dashboard 
            miniatures={filteredMiniatures}
            theme={theme}
        />
    );
};

export default DashboardPage;