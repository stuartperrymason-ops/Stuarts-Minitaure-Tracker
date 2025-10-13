import React from 'react';
import { UploadIcon, DownloadIcon } from '../components/Icons';

interface DataManagementPageProps {
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onExport: () => void;
}

const DataManagementPage: React.FC<DataManagementPageProps> = ({ onImport, onExport }) => {
    return (
        <div className="bg-gray-800/50 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 tracking-wider border-b border-gray-700 pb-4">
                Data Persistence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Save Section */}
                <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Save Collection to File</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Download your entire collection and history as a single JSON file. This is the recommended way to create a permanent backup or to transfer your data to another computer.
                    </p>
                    <button 
                        onClick={onExport} 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        <DownloadIcon />
                        Save to JSON File
                    </button>
                </div>
                {/* Load Section */}
                <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Load Collection from File</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Load a collection from a previously saved JSON file. <strong className="text-yellow-400">Warning:</strong> This will overwrite your current collection and action history.
                    </p>
                    <label 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        <UploadIcon />
                        Load from JSON File
                        <input type="file" accept=".json" className="hidden" onChange={onImport} />
                    </label>
                </div>
            </div>
            <div className="mt-8 p-4 bg-gray-900/30 rounded-lg text-sm text-gray-400">
                <strong>How does saving work?</strong> Your data is automatically saved to your browser's local storage for convenience during a session. Use the "Save to File" option to create a permanent, portable backup that you control.
            </div>
        </div>
    );
};

export default DataManagementPage;