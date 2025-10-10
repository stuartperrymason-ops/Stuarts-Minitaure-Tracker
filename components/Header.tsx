
import React from 'react';
import { PaintBrushIcon } from './Icons';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/30 backdrop-blur-lg shadow-lg border-b border-cyan-500/20 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <PaintBrushIcon />
                        <h1 className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            Miniature Hobby Tracker
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
