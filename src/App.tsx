/**
 * @file src/App.tsx
 * This is the root component of the application. With the new state management architecture,
 * its role is simplified to routing and layout, while the Zustand store handles the complex state logic.
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from './store';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import SettingsPage from './pages/SettingsPage';

// Defines the possible pages/routes in the application.
export type Page = 'dashboard' | 'collection' | 'settings';

/**
 * The main App component.
 * Manages page navigation and renders the overall application layout.
 * @returns {React.FC} The rendered App component.
 */
const App: React.FC = () => {
    // Page state can remain as local component state since it's only used for top-level routing.
    const [page, setPage] = useState<Page>('dashboard');

    // Select actions and state from the Zustand store.
    const { fetchInitialData, activeTheme, isLoading, error } = useAppStore();

    // useEffect hook to fetch initial data from the server when the application first loads.
    // The empty dependency array `[]` ensures this effect runs only once.
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    /**
     * Renders the current page based on the `page` state variable.
     * @returns {JSX.Element} The JSX for the current page.
     */
    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <DashboardPage />;
            case 'collection':
                return <CollectionPage />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <div>Page not found</div>;
        }
    };

    // The component's render output. It sets up the main layout, header, and content area.
    return (
        <div className={`min-h-screen text-gray-100 font-sans transition-colors duration-500 ${activeTheme.bgGradient}`}>
            <Header 
                page={page} 
                setPage={setPage} 
            />
            <main className="container mx-auto p-4 md:p-8">
                {isLoading && (
                    <div className="text-center py-16 text-lg text-gray-400">Loading your collection...</div>
                )}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
                {!isLoading && !error && renderPage()}
            </main>
        </div>
    );
};

export default App;