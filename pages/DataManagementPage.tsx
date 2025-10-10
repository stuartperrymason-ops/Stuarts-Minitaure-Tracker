
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
                Bulk Data Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Export Section */}
                <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Export Collection</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Download your entire collection as a CSV file. This file can be used as a backup or for editing in a spreadsheet application like Excel or Google Sheets.
                    </p>
                    <button 
                        onClick={onExport} 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        <DownloadIcon />
                        Export to CSV
                    </button>
                </div>
                {/* Import Section */}
                <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Import Collection</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Import a collection from a CSV file. <strong className="text-yellow-400">Warning:</strong> This will overwrite all existing data in your current collection.
                    </p>
                    <label 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        <UploadIcon />
                        Import from CSV
                        <input type="file" accept=".csv" className="hidden" onChange={onImport} />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default DataManagementPage;
