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
    id: string;
    modelName: string;
    gameSystem: GameSystem;
    army: string;
    status: Status;
    modelCount: number;
}

export interface Filter {
    gameSystem: GameSystem | 'all';
    army: string;
}