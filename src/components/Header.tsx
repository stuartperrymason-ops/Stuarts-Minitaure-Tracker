/**
 * @file src/components/Header.tsx
 * This component renders the main application header, including the title, navigation links, and a conditional search bar.
 */

import React from 'react';
import { Page } from '../App';
import { useAppStore } from '../store';
import { PaintBrushIcon, SearchIcon, DashboardIcon, CollectionIcon, SettingsIcon } from './Icons';
import { Theme } from '../themes';

// Defines the props (properties) that the Header component expects to receive from its parent.
interface HeaderProps {
    page: Page; // The currently active page.
    setPage: (page: Page) => void; // A function to change the active page.
}

// Defines the props for the internal NavLink component.
interface NavLinkProps {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    icon: React.ReactNode;
    theme: Theme;
}

/**
 * A reusable button component for navigation links in the header.
 * @param {NavLinkProps} props The properties for the NavLink.
 * @returns {JSX.Element} The rendered navigation link button.
 */
const NavLink: React.FC<NavLinkProps> = ({ onClick, isActive, children, icon, theme }) => (
    <button
        onClick={onClick}
        // Dynamically applies different CSS classes based on whether the link is active.
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive 
                ? `${theme.navLinkActiveBg} ${theme.navLinkActiveText}` 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
    >
        {icon}
        {/* The text label is hidden on very small screens for a more compact look. */}
        <span className="hidden sm:inline">{children}</span>
    </button>
);

/**
 * The main Header component.
 * @param {HeaderProps} props The properties passed from the App component.
 * @returns {JSX.Element} The rendered header.
 */
const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
    // Select the necessary state and actions directly from the Zustand store.
    const { searchQuery, setSearchQuery, activeTheme } = useAppStore();

    return (
        // The header has a sticky position to stay at the top of the viewport when scrolling.
        <header className={`${activeTheme.headerBg} shadow-lg border-b ${activeTheme.headerBorder} sticky top-0 z-50 transition-colors duration-300`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    {/* Left section: App Icon and Title */}
                    <div className="flex items-center flex-shrink-0">
                        <PaintBrushIcon />
                        <h1 className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 hidden lg:block">
                            Miniature Hobby Tracker
                        </h1>
                    </div>

                    {/* Middle section: Navigation */}
                    <nav className="flex items-center gap-2 sm:gap-4">
                        <NavLink onClick={() => setPage('dashboard')} isActive={page === 'dashboard'} icon={<DashboardIcon />} theme={activeTheme}>Dashboard</NavLink>
                        <NavLink onClick={() => setPage('collection')} isActive={page === 'collection'} icon={<CollectionIcon />} theme={activeTheme}>Collection</NavLink>
                        <NavLink onClick={() => setPage('settings')} isActive={page === 'settings'} icon={<SettingsIcon />} theme={activeTheme}>Settings</NavLink>
                    </nav>

                    {/* Right section: Search Bar */}
                    <div className="flex-1 flex justify-end">
                        {/* The search bar is only rendered if the current page is 'collection'. */}
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
                                    className={`w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 ${activeTheme.accentRing} transition-colors`}
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