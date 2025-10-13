import React from 'react';
import { Miniature } from '../types';
import Dashboard from '../components/Dashboard';

interface DashboardPageProps {
    filteredMiniatures: Miniature[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ filteredMiniatures }) => {
    return (
        <Dashboard 
            miniatures={filteredMiniatures}
        />
    );
};

export default DashboardPage;