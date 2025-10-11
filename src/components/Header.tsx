import React from 'react';
import { Page } from '../App';
import { PaintBrushIcon, SearchIcon, DashboardIcon, CollectionIcon } from './Icons';
import { Theme } from '../themes';

interface HeaderProps {
    page: Page;
    setPage: (page: Page) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    theme: Theme;
}

interface NavLinkProps {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    icon: React.ReactNode;
    theme: Theme;
}

const NavLink: React.FC<NavLinkProps> = ({ onClick, isActive, children, icon, theme }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive 
                ? `${theme.navLinkActiveBg} ${theme.navLinkActiveText}` 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
    >
        {icon}
        <span className="hidden sm:inline">{children}</span>
    </button>
);

const Header: React.FC<HeaderProps> = ({ page, setPage, searchQuery, setSearchQuery, theme }) => {
    return (
        <header className={`${theme.headerBg} shadow-lg border-b ${theme.headerBorder} sticky top-0 z-50 transition-colors duration-300`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    <div className="flex items-center flex-shrink-0">
                        <PaintBrushIcon />
                        <h1 className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 hidden lg:block">
                            Miniature Hobby Tracker
                        </h1>
                    </div>

                    <nav className="flex items-center gap-2 sm:gap-4">
                        <NavLink onClick={() => setPage('dashboard')} isActive={page === 'dashboard'} icon={<DashboardIcon />} theme={theme}>Dashboard</NavLink>
                        <NavLink onClick={() => setPage('collection')} isActive={page === 'collection'} icon={<CollectionIcon />} theme={theme}>Collection</NavLink>
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
                                    className={`w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 ${theme.accentRing} transition-colors`}
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