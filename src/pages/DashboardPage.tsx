/**
 * @file src/pages/DashboardPage.tsx
 * This component acts as a "page" container for the Dashboard.
 * It now connects directly to the Zustand store to get the data it needs.
 */

import React from 'react';
import Dashboard from '../components/Dashboard';
import { useAppStore } from '../store';

/**
 * The page component for the dashboard route.
 * It primarily renders the main Dashboard component, passing down the necessary props
 * which are retrieved from the central state store.
 * @returns {JSX.Element} The rendered dashboard page.
 */
const DashboardPage: React.FC = () => {
    // Select the required data from the Zustand store.
    // The component will automatically re-render when this data changes.
    const { filteredMiniatures, activeTheme } = useAppStore();

    return (
        <Dashboard 
            miniatures={filteredMiniatures}
            theme={activeTheme}
        />
    );
};

export default DashboardPage;