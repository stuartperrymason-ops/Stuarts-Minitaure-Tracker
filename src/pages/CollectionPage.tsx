import React, { useRef } from 'react';
import { Miniature, Filter, GameSystem, Status } from '../types';
import { SortConfig } from '../App';
import FilterControls from '../components/FilterControls';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import { PlusCircleIcon, DownloadIcon, UploadIcon } from '../components/Icons';
import { Theme } from '../themes';
import { GAME_SYSTEMS, STATUSES } from '../constants';


interface CollectionPageProps {
    filteredMiniatures: Miniature[];
    allMiniatures: Miniature[];
    setMiniatures: React.Dispatch<React.SetStateAction<Miniature[]>>;
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    isFormVisible: boolean;
    editingMiniature: Miniature | null;
    sortConfig: SortConfig;
    onAddNewClick: () => void;
    onFormSubmit: (miniature: Omit<Miniature, 'id'> | Miniature) => void;
    onCancelForm: () => void;
    onEdit: (miniature: Miniature) => void;
    onDelete: (id: string) => void;
    onSort: (key: keyof Miniature) => void;
    theme: Theme;
}

const CollectionPage: React.FC<CollectionPageProps> = (props) => {
    const {
        filteredMiniatures, allMiniatures, setMiniatures, filters, setFilters, isFormVisible, editingMiniature,
        sortConfig, onAddNewClick, onFormSubmit, onCancelForm, onEdit,
        onDelete, onSort, theme
    } = props;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportCSV = () => {
        const headers = ['id', 'modelName', 'gameSystem', 'army', 'status', 'modelCount'];
        const headerRow = headers.join(',');
        
        const csvRows = allMiniatures.map(mini => 
            headers.map(header => `"${mini[header as keyof Miniature]}"`).join(',')
        );

        const csvContent = [headerRow, ...csvRows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'miniatures_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
                alert('CSV file is empty or contains only a header.');
                return;
            }

            const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const expectedHeaders = ['id', 'modelName', 'gameSystem', 'army', 'status', 'modelCount'];
            const hasCorrectHeaders = expectedHeaders.every((h, i) => header[i] === h);

            if (!hasCorrectHeaders) {
                alert(`Invalid CSV header. Expected: ${expectedHeaders.join(',')}`);
                return;
            }

            let newMiniatures: Miniature[] = [];
            let skippedRows = 0;

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                const entry: any = {};
                header.forEach((h, index) => {
                    entry[h] = values[index];
                });

                // Validation
                const modelCount = parseInt(entry.modelCount, 10);
                const isValidGameSystem = GAME_SYSTEMS.includes(entry.gameSystem as GameSystem);
                const isValidStatus = STATUSES.includes(entry.status as Status);

                if (!entry.modelName || !isValidGameSystem || !entry.army || !isValidStatus || isNaN(modelCount) || modelCount < 1) {
                    skippedRows++;
                    continue;
                }

                newMiniatures.push({
                    id: `${Date.now()}-${Math.random()}`, // Generate new unique ID
                    modelName: entry.modelName,
                    gameSystem: entry.gameSystem,
                    army: entry.army,
                    status: entry.status,
                    modelCount: modelCount,
                });
            }

            if (newMiniatures.length > 0) {
                try {
                    const response = await fetch('/api/miniatures/bulk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newMiniatures),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to import miniatures to the database.');
                    }
                    
                    const importedMiniatures = await response.json();
                    setMiniatures(prev => [...prev, ...importedMiniatures]);
                    alert(`Import successful!\nAdded: ${importedMiniatures.length} miniatures.\nSkipped: ${skippedRows} invalid rows.`);

                } catch (error) {
                    console.error(error);
                    alert(`Error during import: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            } else if (skippedRows > 0) {
                 alert(`Import finished. No valid miniatures were found to import. Skipped ${skippedRows} invalid rows.`);
            } else {
                 alert("No miniatures found to import.");
            }
        };

        reader.readAsText(file);
        // Reset file input value to allow importing the same file again
        event.target.value = '';
    };

    return (
        <>
            <FilterControls 
                filters={filters} 
                setFilters={setFilters} 
                allMiniatures={allMiniatures}
                theme={theme}
            />
        
            <div className="my-8 p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className={`text-3xl font-bold ${theme.primaryText} tracking-wider transition-colors duration-300`}>My Collection</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <input type="file" ref={fileInputRef} onChange={handleImportChange} accept=".csv" className="hidden" />
                        <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                            <UploadIcon /> Import CSV
                        </button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                            <DownloadIcon /> Export CSV
                        </button>
                        <button onClick={onAddNewClick} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                            <PlusCircleIcon />
                            Add New
                        </button>
                    </div>
                </div>

                {isFormVisible && (
                    <MiniatureForm 
                        onSubmit={onFormSubmit}
                        initialData={editingMiniature}
                        onCancel={onCancelForm}
                        theme={theme}
                    />
                )}

                <MiniatureList 
                    miniatures={filteredMiniatures} 
                    onEdit={onEdit} 
                    onDelete={onDelete}
                    onSort={onSort}
                    sortConfig={sortConfig}
                />
            </div>
        </>
    );
};

export default CollectionPage;