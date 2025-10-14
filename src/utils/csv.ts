import { Miniature } from "../types";

const CSV_HEADERS: (keyof Omit<Miniature, '_id'>)[] = [
    'modelName',
    'gameSystem',
    'army',
    'status',
    'modelCount',
    'notes'
];

function escapeCsvField(field: any): string {
    if (field === null || field === undefined) {
        return '';
    }
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
}

export function generateCSV(miniatures: Miniature[]): string {
    const headerRow = CSV_HEADERS.join(',');
    const rows = miniatures.map(mini => {
        return CSV_HEADERS.map(header => {
            return escapeCsvField(mini[header]);
        }).join(',');
    });

    return [headerRow, ...rows].join('\n');
}

export function parseCSV(csvText: string): Omit<Miniature, '_id'>[] {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
        throw new Error("CSV file must have a header row and at least one data row.");
    }

    const header = lines[0].split(',').map(h => h.trim());
    const expectedHeader = CSV_HEADERS;
    
    if (JSON.stringify(header) !== JSON.stringify(expectedHeader)) {
        throw new Error(`Invalid CSV header. Expected: "${expectedHeader.join(',')}" but got: "${header.join(',')}"`);
    }

    const dataRows = lines.slice(1);
    const miniatures: Omit<Miniature, '_id'>[] = [];

    for (const row of dataRows) {
        if (!row.trim()) continue;

        // Basic CSV parsing - does not handle commas inside quoted fields well.
        // For a more robust solution, a dedicated library would be better.
        const values = row.split(',');

        const miniature: any = {};
        for (let i = 0; i < header.length; i++) {
            const key = header[i] as keyof Omit<Miniature, '_id'>;
            let value: any = values[i] ? values[i].trim() : '';

            if (key === 'modelCount') {
                value = parseInt(value, 10);
                if (isNaN(value)) {
                    throw new Error(`Invalid modelCount value in row: ${row}`);
                }
            }
            miniature[key] = value;
        }
        miniatures.push(miniature);
    }

    return miniatures;
}
