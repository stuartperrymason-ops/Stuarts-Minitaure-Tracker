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
                Data Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Save Section */}
                <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Export Collection to CSV</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Download your current collection as a CSV file. This file can be easily edited in spreadsheet software like Excel or Google Sheets. This does not include your undo/redo history.
                    </p>
                    <button 
                        onClick={onExport} 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        <DownloadIcon />
                        Export to CSV File
                    </button>
                </div>
                {/* Load Section */}
                <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Import Collection from CSV</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Load a collection from a CSV file. <strong className="text-yellow-400">Warning:</strong> This will overwrite your current collection. The previous collection will be available via the "Undo" button.
                    </p>
                    <label 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        <UploadIcon />
                        Import from CSV File
                        <input type="file" accept=".csv" className="hidden" onChange={onImport} />
                    </label>
                </div>
            </div>
            <div className="mt-8 p-4 bg-gray-900/30 rounded-lg text-sm text-gray-400">
                <strong>How does saving work?</strong> Your data is automatically saved to your browser's local storage for convenience. Use the "Export to CSV" option to create a portable backup that can be edited or shared.
            </div>
        </div>
    );
};

export default DataManagementPage;