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
    _id: string;
    modelName: string;
    gameSystem: string; // Now a string to support user-added systems
    army: string;
    status: Status;
    modelCount: number;
    notes?: string;
    // FIX: Add optional 'images' property to support the image gallery feature.
    images?: string[];
}

export interface Filter {
    gameSystem: string | 'all';
    army: string;
}

export type SortConfig = {
    key: keyof Miniature;
    direction: 'asc' | 'desc';
};