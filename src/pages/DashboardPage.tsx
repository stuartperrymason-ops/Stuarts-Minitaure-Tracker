/**
 * @file src/pages/DashboardPage.tsx
 * This component acts as a "page" container for the Dashboard.
 * In a larger application, this is where page-specific layouts or data fetching might occur.
 */

import React from 'react';
import { Miniature } from '../types';
import Dashboard from '../components/Dashboard';
import { Theme } from '../themes';

// Defines the props expected by the DashboardPage.
interface DashboardPageProps {
    filteredMiniatures: Miniature[]; // The miniatures data, already filtered by the App component.
    theme: Theme; // The active theme object.
}

/**
 * The page component for the dashboard route.
 * It primarily renders the main Dashboard component, passing down the necessary props.
 * @param {DashboardPageProps} props The properties passed from the App component.
 * @returns {JSX.Element} The rendered dashboard page.
 */
const DashboardPage: React.FC<DashboardPageProps> = ({ filteredMiniatures, theme }) => {
    return (
        <Dashboard 
            miniatures={filteredMiniatures}
            theme={theme}
        />
    );
};

export default DashboardPage;
