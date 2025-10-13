/**
 * @file src/components/GameLogoDisplay.tsx
 * This component is responsible for displaying a large, faded logo in the background
 * of the collection page, corresponding to the currently selected game system filter.
 */

import React from 'react';
import { 
    Warhammer40kLogo, AgeOfSigmarLogo, BattletechLogo, StarWarsLegionLogo, 
    MarvelCrisisProtocolLogo, MiddleEarthSBGLogo, OldWorldLogo, ShatterpointLogo,
    GenericSciFiLogo
} from './GameSystemLogos';

// Defines the props for the GameLogoDisplay component.
interface GameLogoDisplayProps {
    gameSystem: string | 'all'; // The name of the currently filtered game system.
}

/**
 * Displays a game-specific logo as a background watermark.
 * @param {GameLogoDisplayProps} props The component's properties.
 * @returns {JSX.Element | null} The rendered logo SVG or null.
 */
const GameLogoDisplay: React.FC<GameLogoDisplayProps> = ({ gameSystem }) => {
    
    /**
     * Selects the appropriate logo component based on the gameSystem prop.
     * @returns {JSX.Element | null} The logo component to render, or null if no specific logo is found.
     */
    const renderLogo = () => {
        // A switch statement maps the string name of the game system to its corresponding logo component.
        switch (gameSystem) {
            case 'Warhammer 40,000':
            case 'Legion Imperialis':
                return <Warhammer40kLogo />;
            case 'Warhammer: Age of Sigmar':
            case 'Conquest - Last Argument of Kings':
                return <AgeOfSigmarLogo />;
            case 'Warhammer: The Old World':
                return <OldWorldLogo />;
            case 'Star Wars: Legion':
                return <StarWarsLegionLogo />;
            case 'Star Wars: Shatterpoint':
                return <ShatterpointLogo />;
            case 'Marvel: Crisis Protocol':
                return <MarvelCrisisProtocolLogo />;
            case 'Battletech':
                return <BattletechLogo />;
            case 'Middle-earth Strategy Battle Game':
                return <MiddleEarthSBGLogo />;
            case 'Dune':
            case 'Trench Crusade':
                 return <GenericSciFiLogo />;
            case 'all': // When "All Systems" is selected, no logo is shown.
            default:
                return null;
        }
    };
    
    const logo = renderLogo();

    return (
        // The logo is positioned absolutely to fill the container and placed behind the main content (z-0).
        // Its opacity is transitioned for a smooth fade-in/out effect when the filter changes.
        <div 
            className={`absolute inset-0 flex items-center justify-center z-0 transition-opacity duration-500 ${logo ? 'opacity-10' : 'opacity-0'}`}
            aria-hidden="true" // Hide from screen readers as it is purely decorative.
        >
            <div className="w-1/2 max-w-lg text-gray-500">
                {logo}
            </div>
        </div>
    );
};

export default GameLogoDisplay;
