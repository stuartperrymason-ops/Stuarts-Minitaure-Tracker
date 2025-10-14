import React from 'react';
import { useAppStore } from '../store';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
    const filteredMiniatures = useAppStore(state => state.filteredMiniatures);
    return (
        <Dashboard 
            miniatures={filteredMiniatures}
        />
    );
};

export default DashboardPage;
