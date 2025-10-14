import React, { useEffect } from 'react';
import { useAppStore } from './store';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import DataManagementPage from './pages/DataManagementPage';
import ImageGalleryModal from './components/ImageGalleryModal';

export type Page = 'dashboard' | 'collection' | 'data';

const App: React.FC = () => {
    const { 
        page, 
        setPage, 
        fetchInitialData, 
        isLoading, 
        error, 
        isGalleryOpen, 
        galleryMiniature, 
        closeImageGallery 
    } = useAppStore();

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const renderPage = () => {
        if (isLoading) {
            return <div className="text-center text-xl text-gray-400 mt-20">Loading your collection...</div>;
        }

        if (error) {
            return (
                <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg mt-20 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
                    <p>{error}</p>
                </div>
            );
        }

        switch (page) {
            case 'dashboard':
                return <DashboardPage />;
            case 'collection':
                return <CollectionPage />;
            case 'data':
                return <DataManagementPage />;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className={`min-h-screen text-gray-100 font-sans transition-colors duration-500 ${useAppStore.getState().activeTheme.bgGradient}`}>
            <Header 
                page={page} 
                setPage={setPage} 
            />
            <main className="container mx-auto p-4 md:p-8">
                {renderPage()}
            </main>
            {isGalleryOpen && galleryMiniature && (
                <ImageGalleryModal 
                    miniature={galleryMiniature} 
                    onClose={closeImageGallery} 
                />
            )}
        </div>
    );
};

export default App;
