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
    // FIX: Changed 'id' to '_id' to match MongoDB's default identifier.
    _id: string;
    modelName: string;
    // FIX: Changed from GameSystem enum to string to allow for user-added game systems.
    gameSystem: string;
    army: string;
    status: Status;
    modelCount: number;
    // FIX: Added optional notes property to align with store logic.
    notes?: string;
    // FIX: Added optional images property for the image gallery feature.
    images?: string[];
}

export interface Filter {
    // FIX: Changed from GameSystem enum to string to align with the Miniature type.
    gameSystem: string | 'all';
    army: string;
}

export type SortConfig = {
    key: keyof Miniature;
    direction: 'asc' | 'desc';
};
