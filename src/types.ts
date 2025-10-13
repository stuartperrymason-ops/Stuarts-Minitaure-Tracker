/**
 * @file src/types.ts
 * This file defines the core data structures and types used throughout the application.
 * Centralizing type definitions improves code clarity, reusability, and type safety.
 */

// Defines the possible completion statuses for a miniature.
// Using a string enum allows for easy mapping to UI elements and database storage.
export enum Status {
    Purchased = "Purchased",
    Printed = "Printed",
    Assembled = "Assembled",
    Primed = "Primed",
    Painted = "Painted",
    Based = "Based",
    ReadyForGame = "Ready for Game"
}

// The main data interface for a miniature entry in the collection.
export interface Miniature {
    _id: string;         // Unique identifier from MongoDB.
    modelName: string;   // Name of the model or unit.
    gameSystem: string;  // The game system the miniature belongs to (e.g., "Warhammer 40,000").
    army: string;        // The army or faction (e.g., "Ultramarines").
    status: Status;      // The current hobby progress status.
    modelCount: number;  // The number of individual models in this entry.
    notes?: string;      // Optional user notes.
    images?: string[]; // An array of URLs to associated images.
}

// Defines the structure for filtering the collection view.
export interface Filter {
    gameSystem: string; // Can be a specific system name or 'all'.
    army: string;       // A string to filter by army name (case-insensitive substring match).
}

// Defines the structure for sorting the collection view.
export type SortConfig = {
    key: keyof Miniature; // The property of the Miniature interface to sort by.
    direction: 'asc' | 'desc'; // The sorting direction.
};