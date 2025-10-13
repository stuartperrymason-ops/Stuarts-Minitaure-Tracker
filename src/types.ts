// FIX: Remove GameSystem enum. Game systems are now fetched as strings from the database.
// This makes the system more flexible and removes the need to update the enum for new games.

export enum Status {
    Purchased = "Purchased",
    Printed = "Printed",
    Assembled = "Assembled",
    Primed = "Primed",
    Painted = "Painted",
    Based = "Based",
    ReadyForGame = "Ready for Game"
}

export interface Miniature {
    id: string;
    modelName: string;
    // FIX: Change GameSystem type from enum to string to support dynamic server-side data.
    gameSystem: string;
    army: string;
    status: Status;
    modelCount: number;
    notes?: string;
}

export interface Filter {
    // FIX: Change GameSystem type from enum to string.
    gameSystem: string | 'all';
    army: string;
}
