/**
 * @file src/themes.ts
 * This file defines the visual themes for the application. It allows for dynamic styling
 * based on the selected game system or army, providing a more immersive user experience.
 */

// The `Theme` interface defines the contract for a theme object.
// Each theme must have these properties, which correspond to various Tailwind CSS classes.
export interface Theme {
  bgGradient: string;
  primaryText: string;
  secondaryText: string;
  accentRing: string;
  button: string;
  headerBg: string;
  headerBorder: string;
  navLinkActiveBg: string;
  navLinkActiveText: string;
  legendText: string;
}

// The `DEFAULT_THEME` is used when no specific game system or army theme is active.
export const DEFAULT_THEME: Theme = {
  bgGradient: 'bg-gray-900',
  primaryText: 'text-cyan-400',
  secondaryText: 'text-purple-400',
  accentRing: 'focus:ring-cyan-500',
  button: 'bg-cyan-600 hover:bg-cyan-500',
  headerBg: 'bg-gray-800/30 backdrop-blur-lg',
  headerBorder: 'border-cyan-500/20',
  navLinkActiveBg: 'bg-cyan-500/20',
  navLinkActiveText: 'text-cyan-300',
  legendText: 'text-gray-400',
};

// `THEMES` is a record mapping game system names (strings) to their specific `Theme` objects.
// Each theme often starts by spreading the `DEFAULT_THEME` and then overriding specific properties.
export const THEMES: Record<string, Theme> = {
  ["Marvel: Crisis Protocol"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-red-900 via-blue-900 to-gray-900',
    primaryText: 'text-red-400',
    secondaryText: 'text-blue-400',
    accentRing: 'focus:ring-red-500',
    button: 'bg-red-700 hover:bg-red-600',
    headerBg: 'bg-gray-900/50 backdrop-blur-lg',
    headerBorder: 'border-red-500/30',
    navLinkActiveBg: 'bg-red-500/20',
    navLinkActiveText: 'text-red-300',
  },
  ["Battletech"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-gray-800 via-green-900/80 to-gray-900',
    primaryText: 'text-green-400',
    secondaryText: 'text-amber-400',
    accentRing: 'focus:ring-green-500',
    button: 'bg-green-700 hover:bg-green-600',
    headerBg: 'bg-gray-900/50 backdrop-blur-lg',
    headerBorder: 'border-green-500/30',
    navLinkActiveBg: 'bg-green-500/20',
    navLinkActiveText: 'text-green-300',
  },
  ["Star Wars: Legion"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-slate-900 via-gray-800 to-black',
    primaryText: 'text-sky-400',
    secondaryText: 'text-red-400',
    accentRing: 'focus:ring-sky-500',
    button: 'bg-sky-700 hover:bg-sky-600',
    headerBg: 'bg-gray-900/50 backdrop-blur-lg',
    headerBorder: 'border-sky-500/30',
    navLinkActiveBg: 'bg-sky-500/20',
    navLinkActiveText: 'text-sky-300',
  },
  ["Star Wars: Shatterpoint"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
    primaryText: 'text-purple-400',
    secondaryText: 'text-yellow-400',
    accentRing: 'focus:ring-purple-500',
    button: 'bg-purple-700 hover:bg-purple-600',
    headerBg: 'bg-gray-900/50 backdrop-blur-lg',
    headerBorder: 'border-purple-500/30',
    navLinkActiveBg: 'bg-purple-500/20',
    navLinkActiveText: 'text-purple-300',
  },
  ["Middle-earth Strategy Battle Game"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-emerald-900 via-stone-900 to-black',
    primaryText: 'text-emerald-400',
    secondaryText: 'text-stone-400',
    accentRing: 'focus:ring-emerald-500',
    button: 'bg-emerald-700 hover:bg-emerald-600',
    headerBg: 'bg-gray-900/50 backdrop-blur-lg',
    headerBorder: 'border-emerald-500/30',
    navLinkActiveBg: 'bg-emerald-500/20',
    navLinkActiveText: 'text-emerald-300',
  },
  ["Warhammer: The Old World"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-amber-900 via-stone-800 to-black',
    primaryText: 'text-amber-400',
    secondaryText: 'text-stone-300',
    accentRing: 'focus:ring-amber-500',
    button: 'bg-amber-700 hover:bg-amber-600',
    headerBg: 'bg-gray-900/50 backdrop-blur-lg',
    headerBorder: 'border-amber-500/30',
    navLinkActiveBg: 'bg-amber-500/20',
    navLinkActiveText: 'text-amber-300',
  },
  ["Warhammer: Age of Sigmar"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-fuchsia-900 via-indigo-900 to-black',
    primaryText: 'text-fuchsia-400',
    secondaryText: 'text-sky-400',
    accentRing: 'focus:ring-fuchsia-500',
    button: 'bg-fuchsia-700 hover:bg-fuchsia-600',
    headerBg: 'bg-gray-900/50 backdrop-blur-lg',
    headerBorder: 'border-fuchsia-500/30',
    navLinkActiveBg: 'bg-fuchsia-500/20',
    navLinkActiveText: 'text-fuchsia-300',
  },
  ["Warhammer 40,000"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-red-900/80 via-gray-900 to-black',
    primaryText: 'text-red-500',
    secondaryText: 'text-gray-400',
    accentRing: 'focus:ring-red-500',
    button: 'bg-red-800 hover:bg-red-700',
    headerBg: 'bg-gray-900/50 backdrop-blur-lg',
    headerBorder: 'border-red-500/30',
    navLinkActiveBg: 'bg-red-500/20',
    navLinkActiveText: 'text-red-300',
  },
  ["Dune"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-orange-900 via-amber-800 to-black',
    primaryText: 'text-orange-400',
    secondaryText: 'text-sky-400',
    accentRing: 'focus:ring-orange-500',
    button: 'bg-orange-700 hover:bg-orange-600',
    headerBorder: 'border-orange-500/30',
    navLinkActiveBg: 'bg-orange-500/20',
    navLinkActiveText: 'text-orange-300',
  },
  ["Trench Crusade"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-stone-800 via-gray-900 to-black',
    primaryText: 'text-stone-400',
    secondaryText: 'text-red-500',
    accentRing: 'focus:ring-stone-500',
    button: 'bg-stone-700 hover:bg-stone-600',
    headerBorder: 'border-stone-500/30',
    navLinkActiveBg: 'bg-stone-500/20',
    navLinkActiveText: 'text-stone-300',
  },
  ["Legion Imperialis"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-slate-900 via-gray-900 to-black',
    primaryText: 'text-slate-300',
    secondaryText: 'text-amber-400',
    accentRing: 'focus:ring-slate-400',
    button: 'bg-slate-700 hover:bg-slate-600',
    headerBorder: 'border-slate-500/30',
    navLinkActiveBg: 'bg-slate-500/20',
    navLinkActiveText: 'text-slate-300',
  },
  ["Conquest - Last Argument of Kings"]: {
    ...DEFAULT_THEME,
    bgGradient: 'bg-gradient-to-br from-teal-900 via-purple-900/60 to-black',
    primaryText: 'text-teal-400',
    secondaryText: 'text-purple-400',
    accentRing: 'focus:ring-teal-500',
    button: 'bg-teal-700 hover:bg-teal-600',
    headerBorder: 'border-teal-500/30',
    navLinkActiveBg: 'bg-teal-500/20',
    navLinkActiveText: 'text-teal-300',
  }
};

// `ARMY_THEMES` provides overrides for specific army/faction names within a game system.
// This allows for even more granular theming. The structure is nested: Game System -> Army Name -> Partial Theme Object.
// A `Partial<Theme>` means the object can contain any subset of the keys defined in the `Theme` interface.
export const ARMY_THEMES: Record<string, Record<string, Partial<Theme>>> = {
    ["Warhammer 40,000"]: {
        "Ultramarines": {
            bgGradient: 'bg-gradient-to-br from-blue-900 via-gray-800 to-black',
            primaryText: 'text-blue-400',
            secondaryText: 'text-yellow-300',
            accentRing: 'focus:ring-blue-400',
            button: 'bg-blue-700 hover:bg-blue-600',
            headerBorder: 'border-blue-500/30',
            navLinkActiveBg: 'bg-blue-500/20',
            navLinkActiveText: 'text-blue-300',
        },
        "Blood Angels": {
            primaryText: 'text-red-400',
            secondaryText: 'text-yellow-400',
            button: 'bg-red-800 hover:bg-red-700',
            headerBorder: 'border-red-500/30',
            navLinkActiveBg: 'bg-red-500/20',
            navLinkActiveText: 'text-red-300',
        },
        "Imperial Fists": {
            bgGradient: 'bg-gradient-to-br from-yellow-900/80 via-gray-800 to-black',
            primaryText: 'text-yellow-400',
            secondaryText: 'text-red-400',
            accentRing: 'focus:ring-yellow-500',
            button: 'bg-yellow-700 hover:bg-yellow-600',
            headerBorder: 'border-yellow-500/30',
            navLinkActiveBg: 'bg-yellow-500/20',
            navLinkActiveText: 'text-yellow-300',
        },
    },
    ["Star Wars: Legion"]: {
        "Rebel Alliance": {
            bgGradient: 'bg-gradient-to-br from-orange-900/80 via-stone-800 to-black',
            primaryText: 'text-orange-400',
            secondaryText: 'text-gray-300',
            accentRing: 'focus:ring-orange-500',
            button: 'bg-orange-700 hover:bg-orange-600',
            headerBorder: 'border-orange-500/30',
            navLinkActiveBg: 'bg-orange-500/20',
            navLinkActiveText: 'text-orange-300',
        },
        "Galactic Empire": {
            bgGradient: 'bg-gradient-to-br from-gray-900 via-black to-red-900/70',
            primaryText: 'text-gray-200',
            secondaryText: 'text-red-500',
            accentRing: 'focus:ring-red-600',
            button: 'bg-gray-700 hover:bg-gray-600',
            headerBorder: 'border-red-500/30',
            navLinkActiveBg: 'bg-red-500/20',
            navLinkActiveText: 'text-red-300',
        }
    },
    ["Warhammer: Age of Sigmar"]: {
        "Stormcast Eternals": {
            bgGradient: 'bg-gradient-to-br from-yellow-800/80 via-sky-900 to-black',
            primaryText: 'text-yellow-300',
            secondaryText: 'text-sky-300',
            accentRing: 'focus:ring-yellow-400',
            button: 'bg-yellow-600 hover:bg-yellow-500',
            headerBorder: 'border-yellow-500/30',
            navLinkActiveBg: 'bg-yellow-500/20',
            navLinkActiveText: 'text-yellow-300',
        }
    }
};
