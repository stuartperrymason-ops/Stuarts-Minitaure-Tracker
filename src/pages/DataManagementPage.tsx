import React from 'react';
import { useAppStore } from '../store';
import { generateCSV, parseCSV } from '../utils/csv';
import { UploadIcon, DownloadIcon } from '../components/Icons';

const DataManagementPage: React.FC = () => {
    const { miniatures, importData } = useAppStore();

    const handleExport = () => {
        try {
            const csvContent = generateCSV(miniatures);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', url);
            linkElement.setAttribute('download', 'miniature_tracker_data.csv');
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        } catch (error) {
            alert('An error occurred while preparing the data for saving.');
            console.error(error);
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error('Could not read file content.');
                
                const parsedData = parseCSV(text);

                if (window.confirm(`This will overwrite your entire collection with ${parsedData.length} entries from the CSV file. This action cannot be undone. Proceed?`)) {
                    await importData(parsedData);
                    alert(`Successfully loaded ${parsedData.length} miniatures from file.`);
                }

            } catch (error) {
                alert(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`);
                console.error(error);
            } finally {
                event.target.value = '';
            }
        };
        reader.onerror = () => { alert('An error occurred while reading the file.'); event.target.value = ''; };
        reader.readAsText(file);
    };


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
                        Download your entire collection as a CSV file. This is a great way to create a backup or view your data in a spreadsheet application like Excel or Google Sheets.
                    </p>
                    <button 
                        onClick={handleExport} 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        <DownloadIcon />
                        Export to CSV
                    </button>
                </div>
                {/* Load Section */}
                <div className="bg-gray-900/50 p-6 rounded-lg shadow-inner flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Import Collection from CSV</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Load a collection from a CSV file. <strong className="text-yellow-400">Warning:</strong> This will completely overwrite your current collection in the database.
                    </p>
                    <label 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        <UploadIcon />
                        Import from CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                    </label>
                </div>
            </div>
            <div className="mt-8 p-4 bg-gray-900/30 rounded-lg text-sm text-gray-400">
                <strong>How does saving work?</strong> Your data is now saved in a central database. Use the import/export features to create local backups or to migrate your data between different systems.
            </div>
        </div>
    );
};

export default DataManagementPage;