export enum GameSystem {
    MarvelCrisisProtocol = "Marvel: Crisis Protocol",
    Battletech = "Battletech",
    StarWarsLegion = "Star Wars: Legion",
    StarWarsShatterpoint = "Star Wars: Shatterpoint",
    MiddleEarthSBG = "Middle-earth Strategy Battle Game",
    WarhammerOldWorld = "Warhammer: The Old World",
    AgeOfSigmar = "Warhammer: Age of Sigmar",
    Warhammer40k = "Warhammer 40,000"
}

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
    // FIX: Switched from 'id' to '_id' to align with MongoDB's default property, resolving numerous type errors in the data store.
    _id: string;
    modelName: string;
    // FIX: Changed type to string to support dynamically added game systems.
    gameSystem: string;
    army: string;
    status: Status;
    modelCount: number;
    // FIX: Added optional 'notes' and 'images' properties to support new features and fix related type errors.
    notes?: string;
    images?: string[];
}

export interface Filter {
    // FIX: Changed type to string to support dynamically added game systems.
    gameSystem: string | 'all';
    army: string;
}

// FIX: Added SortConfig type definition to be used across the application, resolving an import error in the store.
export type SortConfig = {
    key: keyof Miniature;
    direction: 'asc' | 'desc';
};
