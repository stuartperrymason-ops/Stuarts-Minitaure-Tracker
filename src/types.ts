/**
 * @file src/types.ts
 * This file defines the core data structures and types used throughout the application.
 * Using TypeScript for type safety helps prevent common bugs and improves code readability.
 */

// A TypeScript `enum` is a way of giving more friendly names to sets of numeric values.
// Here, we use a string enum for better readability and debugging.
export enum Status {
    Purchased = "Purchased",
    Printed = "Printed",
    Assembled = "Assembled",
    Primed = "Primed",
    Painted = "Painted",
    Based = "Based",
    ReadyForGame = "Ready for Game"
}

// An `interface` defines the shape of an object.
// This ensures that any object treated as a 'Miniature' has these specific properties.
export interface Miniature {
    id: string; // A unique identifier for the miniature entry.
    modelName: string; // The name of the model or unit.
    gameSystem: string; // The game system the miniature belongs to. Changed from enum to string to support dynamic, user-added systems.
    army: string; // The army or faction.
    status: Status; // The current hobby progress status, using the Status enum.
    modelCount: number; // The number of models in this unit/entry.
    notes?: string; // An optional field for user notes (e.g., paint recipes, lore). The '?' makes it optional.
}

// Defines the shape of the filters object used on the Collection page.
export interface Filter {
    gameSystem: string | 'all'; // Can be a specific game system string or 'all' to show everything.
    army: string; // The text used to filter by army/faction name.
}
