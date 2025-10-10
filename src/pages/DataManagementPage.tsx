import React from 'react';
import { UploadIcon, DownloadIcon } from '../components/Icons';

interface DataManagementPageProps {
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onExport: () => void;
}

const DataManagementPage: React.FC<DataManagementPageProps> = ({ onImport, onExport }) => {
    return (
        <div className="space-y-8">
            <div className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50">
                <h2 className="text-3xl font-bold text-cyan-400 mb-2 tracking-wide">
                    Data Management
                </h2>
                <p className="text-gray-400">
                    Save a portable backup of your collection or load data from a file.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Save Section */}
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700/50 flex flex-col">
                    <h3 className="text-2xl font-semibold text-purple-400 mb-4">Export Collection to CSV</h3>
                    <p className="text-gray-300 mb-6 flex-grow">
                        Download your current collection as a CSV file. This file can be easily edited in spreadsheet software like Excel or Google Sheets. This does not include your undo/redo history.
                    </p>
                    <button 
                        onClick={onExport} 
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        <DownloadIcon />
                        Export to CSV File
                    </button>
                </div>
                {/* Load Section */}
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700/50 flex flex-col">
                    <h3 className="text-2xl font-semibold text-purple-400 mb-4">Import Collection from CSV</h3>
                    <p className="text-gray-300 mb-6 flex-grow">
                        Load a collection from a CSV file. <strong className="text-yellow-400">Warning:</strong> This will overwrite your current collection. The previous collection will be available via the "Undo" button.
                    </p>
                    <label 
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        <UploadIcon />
                        Import from CSV File
                        <input type="file" accept=".csv" className="hidden" onChange={onImport} />
                    </label>
                </div>
            </div>
             <div className="mt-8 p-4 bg-gray-800/30 rounded-lg text-sm text-gray-400 border border-gray-700/50">
                <strong>How does saving work?</strong> Your data is automatically saved to your browser's local storage for convenience. Use the "Export to CSV" option to create a portable backup that can be edited or shared.
            </div>
        </div>
    );
};

export default DataManagementPage;