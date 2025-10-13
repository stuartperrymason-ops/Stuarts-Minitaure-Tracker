/**
 * @file src/components/GameLogoDisplay.tsx
 * This component is responsible for displaying a large, faded logo in the background
 * of the collection page, corresponding to the currently selected game system filter.
 * It dynamically constructs an image path to a JPEG file based on the game system name.
 */

import React from 'react';

// Defines the props for the GameLogoDisplay component.
interface GameLogoDisplayProps {
    gameSystem: string | 'all'; // The name of the currently filtered game system.
}

/**
 * Converts a game system name into a URL-friendly filename for the logo.
 * Example: "Warhammer: The Old World" -> "warhammer-the-old-world"
 * @param {string} name The full name of the game system.
 * @returns {string} A sanitized string suitable for a filename.
 */
const generateFilename = (name: string): string => {
    return name
        .toLowerCase()
        // Replace common characters/words for better matching
        .replace(/&/g, 'and') 
        .replace(/[:]/g, '') // Remove colons
        // Generic cleanup
        .replace(/[^\w\s-]/g, '') // Remove remaining punctuation except hyphens and whitespace
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with a single hyphen
        .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
};

/**
 * Displays a game-specific logo as a background watermark.
 * @param {GameLogoDisplayProps} props The component's properties.
 * @returns {JSX.Element} The rendered logo image container.
 */
const GameLogoDisplay: React.FC<GameLogoDisplayProps> = ({ gameSystem }) => {
    
    // Determine the source of the logo based on the selected game system.
    let logoSrc: string | null = null;
    if (gameSystem !== 'all') {
        const filename = generateFilename(gameSystem);
        // This assumes that a 'game-logos' directory exists in the public assets folder.
        logoSrc = `/game-logos/${filename}.jpeg`;
    }

    return (
        // The container div handles the positioning and fade-in/out transition.
        // Its opacity is changed based on whether a logoSrc is available.
        <div 
            className={`absolute inset-0 flex items-center justify-center z-0 transition-opacity duration-500 ${logoSrc ? 'opacity-20' : 'opacity-0'}`}
            aria-hidden="true" // Hide from screen readers as it is purely decorative.
        >
            <div className="w-1/2 max-w-lg text-gray-500">
                {/* Only render the image tag if there is a source to prevent broken image icons. */}
                {logoSrc && (
                    <img 
                        src={logoSrc} 
                        alt={`${gameSystem} logo`} 
                        className="w-full h-auto object-contain animate-fade-in" 
                        // Using the key forces a re-render and re-triggers the animation when the logo changes.
                        key={logoSrc}
                    />
                )}
            </div>
        </div>
    );
};

export default GameLogoDisplay;