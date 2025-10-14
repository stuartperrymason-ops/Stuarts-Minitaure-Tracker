import { Miniature } from "../types";

const CSV_HEADERS: (keyof Omit<Miniature, '_id' | 'images'>)[] = [
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
            return escapeCsvField(mini[header as keyof Miniature]);
        }).join(',');
    });

    return [headerRow, ...rows].join('\n');
}


function parseCsvRow(row: string): string[] {
    const result: string[] = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            if (inQuotes && row[i+1] === '"') {
                currentField += '"';
                i++; // Skip the second quote in a pair
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    result.push(currentField);
    return result;
}


export function parseCSV(csvText: string): Omit<Miniature, '_id'>[] {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 1 || (lines.length === 1 && !lines[0].trim())) {
        return [];
    }

    const header = parseCsvRow(lines[0]).map(h => h.trim());
    
    const isValidHeader = header.length === CSV_HEADERS.length && header.every((h, i) => h === CSV_HEADERS[i]);

    if (!isValidHeader) {
        throw new Error(`Invalid CSV header. Expected: "${CSV_HEADERS.join(',')}" but got: "${header.join(',')}"`);
    }

    const dataRows = lines.slice(1);
    const miniatures: Omit<Miniature, '_id'>[] = [];

    for (const row of dataRows) {
        if (!row.trim()) continue;

        const values = parseCsvRow(row);

        if (values.length !== CSV_HEADERS.length) {
            console.warn(`Skipping malformed CSV row (column count mismatch): ${row}`);
            continue;
        }

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