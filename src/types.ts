export type GameSystem = string;

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
    notes?: string;
}

export interface Filter {
    gameSystem: GameSystem | 'all';
    army: string;
}