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
    const rawLines = csvText.trim().split(/\r?\n/);
    if (rawLines.length === 0 || (rawLines.length === 1 && !rawLines[0].trim())) {
        return [];
    }

    const logicalRows: string[] = [];
    let rowBuffer = '';

    for (const line of rawLines) {
        rowBuffer += (rowBuffer ? '\n' : '') + line;
        const quoteCount = (rowBuffer.match(/"/g) || []).length;
        
        // If the number of quotes is even, we assume the row is complete.
        // This handles multiline fields correctly.
        if (quoteCount % 2 === 0) {
            logicalRows.push(rowBuffer);
            rowBuffer = '';
        }
    }
    
    if (rowBuffer) {
        logicalRows.push(rowBuffer); // Add any remaining buffer as the last line
    }

    if (logicalRows.length < 1) {
        return [];
    }
    
    const header = parseCsvRow(logicalRows[0]).map(h => h.trim());
    
    const isValidHeader = header.length === CSV_HEADERS.length && header.every((h, i) => h === CSV_HEADERS[i]);

    if (!isValidHeader) {
        throw new Error(`Invalid CSV header. Expected: "${CSV_HEADERS.join(',')}" but got: "${header.join(',')}"`);
    }

    const dataRows = logicalRows.slice(1);
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