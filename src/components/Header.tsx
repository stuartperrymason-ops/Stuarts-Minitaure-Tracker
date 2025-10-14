import React from 'react';
import { Page } from '../App';
import { useAppStore } from '../store';
import { PaintBrushIcon, SearchIcon, DashboardIcon, CollectionIcon, DatabaseIcon } from './Icons';

interface HeaderProps {
    page: Page;
    setPage: (page: Page) => void;
}

interface NavLinkProps {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    icon: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ onClick, isActive, children, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive 
                ? 'bg-cyan-500/20 text-cyan-300' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="hidden sm:inline">{children}</span>
    </button>
);

const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
    const { searchQuery, setSearchQuery } = useAppStore();

    return (
        <header className="bg-gray-800/30 backdrop-blur-lg shadow-lg border-b border-cyan-500/20 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    <div className="flex items-center flex-shrink-0">
                        <PaintBrushIcon />
                        <h1 className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 hidden lg:block">
                            Miniature Hobby Tracker
                        </h1>
                    </div>

                    <nav className="flex items-center gap-2 sm:gap-4">
                        <NavLink onClick={() => setPage('dashboard')} isActive={page === 'dashboard'} icon={<DashboardIcon />}>Dashboard</NavLink>
                        <NavLink onClick={() => setPage('collection')} isActive={page === 'collection'} icon={<CollectionIcon />}>Collection</NavLink>
                        <NavLink onClick={() => setPage('data')} isActive={page === 'data'} icon={<DatabaseIcon />}>Data</NavLink>
                    </nav>

                    <div className="flex-1 flex justify-end">
                        {page === 'collection' && (
                            <div className="relative w-full max-w-xs">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <SearchIcon />
                                </span>
                                <input
                                    type="search"
                                    placeholder="Search collection..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                                    aria-label="Search collection"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
