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
    // FIX: Changed `id` to `_id` to match the database schema from MongoDB.
    _id: string;
    modelName: string;
    gameSystem: GameSystem;
    army: string;
    status: Status;
    modelCount: number;
    // FIX: Added optional `notes` property to allow for storing additional details.
    notes?: string;
    // FIX: Added optional `images` property to support the image gallery feature.
    images?: string[];
}

export interface Filter {
    gameSystem: GameSystem | 'all';
    army: string;
}

// FIX: Moved SortConfig from App.tsx to make it reusable across different components and the store.
export type SortConfig = {
    key: keyof Miniature;
    direction: 'asc' | 'desc';
};