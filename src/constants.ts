/**
 * @file src/constants.ts
 * This file exports constant values that are used in multiple places across the application.
 * Using a constants file helps avoid "magic strings" or "magic numbers" and provides a single source of truth.
 */

import { Status } from './types';

// Creates an array of all possible Status enum values.
// This is useful for populating dropdowns in forms or iterating over all statuses.
export const STATUSES: Status[] = Object.values(Status);

// A record (or dictionary) that maps each Status to a specific hex color code.
// This is used to display status indicators with consistent colors throughout the UI.
// Using a Record type provides type safety, ensuring every Status has a color defined.
export const STATUS_COLORS: Record<Status, string> = {
    [Status.Purchased]: '#ef4444', // red-500
    [Status.Printed]: '#f97316', // orange-500
    [Status.Assembled]: '#eab308', // yellow-500
    [Status.Primed]: '#84cc16', // lime-500
    [Status.Painted]: '#22c55e', // green-500
    [Status.Based]: '#10b981', // emerald-500
    [Status.ReadyForGame]: '#06b6d4', // cyan-500
};

// A record that maps each Status to a numerical progress value.
// This is used in charts and progress calculations to give a quantitative measure of hobby progress.
export const STATUS_PROGRESS: Record<Status, number> = {
    [Status.Purchased]: 1,
    [Status.Printed]: 2,
    [Status.Assembled]: 3,
    [Status.Primed]: 4,
    [Status.Painted]: 5,
    [Status.Based]: 6,
    [Status.ReadyForGame]: 7,
};
