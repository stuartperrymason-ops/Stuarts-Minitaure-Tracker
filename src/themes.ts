import { GameSystem } from './types';

export interface Theme {
  bgGradient: string;
  primaryText: string;
  secondaryText: string;
  accentRing: string;
  button: string;
  // FIX: Added legendText property for styling chart legends.
  legendText: string;
}

export const DEFAULT_THEME: Theme = {
  bgGradient: 'bg-gray-900',
  primaryText: 'text-cyan-400',
  secondaryText: 'text-purple-400',
  accentRing: 'focus:ring-cyan-500',
  button: 'bg-cyan-600 hover:bg-cyan-500',
  // FIX: Added default value for legendText.
  legendText: 'text-gray-300',
};

// FIX: Changed record key from GameSystem to string to allow for dynamically added game systems.
export const THEMES: Record<string, Theme> = {
  [GameSystem.MarvelCrisisProtocol]: {
    bgGradient: 'bg-gradient-to-br from-red-900 via-blue-900 to-gray-900',
    primaryText: 'text-red-400',
    secondaryText: 'text-blue-400',
    accentRing: 'focus:ring-red-500',
    button: 'bg-red-700 hover:bg-red-600',
  },
  [GameSystem.Battletech]: {
    bgGradient: 'bg-gradient-to-br from-gray-800 via-green-900/80 to-gray-900',
    primaryText: 'text-green-400',
    secondaryText: 'text-amber-400',
    accentRing: 'focus:ring-green-500',
    button: 'bg-green-700 hover:bg-green-600',
  },
  [GameSystem.StarWarsLegion]: {
    bgGradient: 'bg-gradient-to-br from-slate-900 via-gray-800 to-black',
    primaryText: 'text-sky-400',
    secondaryText: 'text-red-400',
    accentRing: 'focus:ring-sky-500',
    button: 'bg-sky-700 hover:bg-sky-600',
  },
  [GameSystem.StarWarsShatterpoint]: {
    bgGradient: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
    primaryText: 'text-purple-400',
    secondaryText: 'text-yellow-400',
    accentRing: 'focus:ring-purple-500',
    button: 'bg-purple-700 hover:bg-purple-600',
  },
  [GameSystem.MiddleEarthSBG]: {
    bgGradient: 'bg-gradient-to-br from-emerald-900 via-stone-900 to-black',
    primaryText: 'text-emerald-400',
    secondaryText: 'text-stone-400',
    accentRing: 'focus:ring-emerald-500',
    button: 'bg-emerald-700 hover:bg-emerald-600',
  },
  [GameSystem.WarhammerOldWorld]: {
    bgGradient: 'bg-gradient-to-br from-amber-900 via-stone-800 to-black',
    primaryText: 'text-amber-400',
    secondaryText: 'text-stone-300',
    accentRing: 'focus:ring-amber-500',
    button: 'bg-amber-700 hover:bg-amber-600',
  },
  [GameSystem.AgeOfSigmar]: {
    bgGradient: 'bg-gradient-to-br from-fuchsia-900 via-indigo-900 to-black',
    primaryText: 'text-fuchsia-400',
    secondaryText: 'text-sky-400',
    accentRing: 'focus:ring-fuchsia-500',
    button: 'bg-fuchsia-700 hover:bg-fuchsia-600',
  },
  [GameSystem.Warhammer40k]: {
    bgGradient: 'bg-gradient-to-br from-red-900/80 via-gray-900 to-black',
    primaryText: 'text-red-500',
    secondaryText: 'text-gray-400',
    accentRing: 'focus:ring-red-500',
    button: 'bg-red-800 hover:bg-red-700',
  },
};

export const ARMY_THEMES: Record<string, Record<string, Partial<Theme>>> = {
    [GameSystem.Warhammer40k]: {
        "Ultramarines": {
            bgGradient: 'bg-gradient-to-br from-blue-900 via-gray-800 to-black',
            primaryText: 'text-blue-400',
            secondaryText: 'text-yellow-300',
            accentRing: 'focus:ring-blue-400',
            button: 'bg-blue-700 hover:bg-blue-600',
        },
        "Blood Angels": {
            primaryText: 'text-red-400',
            secondaryText: 'text-yellow-400',
            button: 'bg-red-800 hover:bg-red-700',
        },
        "Imperial Fists": {
            bgGradient: 'bg-gradient-to-br from-yellow-900/80 via-gray-800 to-black',
            primaryText: 'text-yellow-400',
            secondaryText: 'text-red-400',
            accentRing: 'focus:ring-yellow-500',
            button: 'bg-yellow-700 hover:bg-yellow-600',
        },
    },
    [GameSystem.StarWarsLegion]: {
        "Rebel Alliance": {
            bgGradient: 'bg-gradient-to-br from-orange-900/80 via-stone-800 to-black',
            primaryText: 'text-orange-400',
            secondaryText: 'text-gray-300',
            accentRing: 'focus:ring-orange-500',
            button: 'bg-orange-700 hover:bg-orange-600',
        },
        "Galactic Empire": {
            bgGradient: 'bg-gradient-to-br from-gray-900 via-black to-red-900/70',
            primaryText: 'text-gray-200',
            secondaryText: 'text-red-500',
            accentRing: 'focus:ring-red-600',
            button: 'bg-gray-700 hover:bg-gray-600',
        }
    },
    [GameSystem.AgeOfSigmar]: {
        "Stormcast Eternals": {
            bgGradient: 'bg-gradient-to-br from-yellow-800/80 via-sky-900 to-black',
            primaryText: 'text-yellow-300',
            secondaryText: 'text-sky-300',
            accentRing: 'focus:ring-yellow-400',
            button: 'bg-yellow-600 hover:bg-yellow-500',
        }
    }
};
