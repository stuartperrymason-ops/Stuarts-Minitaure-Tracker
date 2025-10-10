
import { GameSystem, Status } from './types';

export const GAME_SYSTEMS: GameSystem[] = Object.values(GameSystem);
export const STATUSES: Status[] = Object.values(Status);

export const STATUS_COLORS: Record<Status, string> = {
    [Status.Purchased]: '#ef4444', // red-500
    [Status.Printed]: '#f97316', // orange-500
    [Status.Assembled]: '#eab308', // yellow-500
    [Status.Primed]: '#84cc16', // lime-500
    [Status.Painted]: '#22c55e', // green-500
    [Status.Based]: '#10b981', // emerald-500
    [Status.ReadyForGame]: '#06b6d4', // cyan-500
};

export const STATUS_PROGRESS: Record<Status, number> = {
    [Status.Purchased]: 1,
    [Status.Printed]: 2,
    [Status.Assembled]: 3,
    [Status.Primed]: 4,
    [Status.Painted]: 5,
    [Status.Based]: 6,
    [Status.ReadyForGame]: 7,
};
