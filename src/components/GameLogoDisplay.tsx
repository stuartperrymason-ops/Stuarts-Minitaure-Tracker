import React from 'react';
// FIX: Remove GameSystem enum import, as it has been replaced by string.
import { 
    Warhammer40kLogo, AgeOfSigmarLogo, BattletechLogo, StarWarsLegionLogo, 
    MarvelCrisisProtocolLogo, MiddleEarthSBGLogo, OldWorldLogo, ShatterpointLogo,
    GenericSciFiLogo, GenericFantasyLogo
} from './GameSystemLogos';

interface GameLogoDisplayProps {
    // FIX: Change type to string to match new data structure and resolve comparison errors.
    gameSystem: string | 'all';
}

const GameLogoDisplay: React.FC<GameLogoDisplayProps> = ({ gameSystem }) => {
    
    const renderLogo = () => {
        switch (gameSystem) {
            case 'Warhammer 40,000':
            // FIX: Comparison is now valid since gameSystem is a string.
            case 'Legion Imperialis':
                return <Warhammer40kLogo />;
            case 'Warhammer: Age of Sigmar':
            // FIX: Comparison is now valid.
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
            // FIX: Comparison is now valid.
            case 'Dune':
            // FIX: Comparison is now valid.
            case 'Trench Crusade':
                 return <GenericSciFiLogo />;
            case 'all':
            default:
                return null;
        }
    };
    
    const logo = renderLogo();

    return (
        <div 
            className={`absolute inset-0 flex items-center justify-center z-0 transition-opacity duration-500 ${logo ? 'opacity-10' : 'opacity-0'}`}
            aria-hidden="true"
        >
            <div className="w-1/2 max-w-lg text-gray-500">
                {logo}
            </div>
        </div>
    );
};

export default GameLogoDisplay;
