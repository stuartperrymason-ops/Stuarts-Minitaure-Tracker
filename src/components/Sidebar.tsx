import React from 'react';
import { Page } from '../App';
import { PaintBrushIcon, DashboardIcon, CollectionIcon, DatabaseIcon } from './Icons';
import { Theme } from '../themes';

interface SidebarProps {
    page: Page;
    setPage: (page: Page) => void;
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
        className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
            isActive 
                ? `${theme.button} text-white shadow-lg` 
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }`}
    >
        {icon}
        <span className="truncate">{children}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ page, setPage, theme }) => {
    return (
        <aside className={`flex flex-col w-64 ${theme.sidebarBg} border-r border-gray-700/50 p-4 transition-all duration-500 shrink-0 backdrop-blur-lg`}>
            <div className="flex items-center gap-3 px-2 mb-8">
                <PaintBrushIcon className="h-8 w-8 text-cyan-400 shrink-0" />
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    Hobby Tracker
                </h1>
            </div>

            <nav className="flex flex-col gap-2">
                <NavLink onClick={() => setPage('dashboard')} isActive={page === 'dashboard'} icon={<DashboardIcon />} theme={theme}>
                    Dashboard
                </NavLink>
                <NavLink onClick={() => setPage('collection')} isActive={page === 'collection'} icon={<CollectionIcon />} theme={theme}>
                    Collection
                </NavLink>
                <NavLink onClick={() => setPage('data')} isActive={page === 'data'} icon={<DatabaseIcon />} theme={theme}>
                    Data Management
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;