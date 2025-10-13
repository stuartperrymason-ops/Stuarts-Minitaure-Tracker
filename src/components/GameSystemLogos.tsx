import React from 'react';

const SvgWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor">
        {children}
    </svg>
);

export const Warhammer40kLogo: React.FC = () => (
    <SvgWrapper>
        <path d="M50 10 L60 25 L55 25 L65 40 L70 40 L60 55 L75 55 L75 60 L60 60 L70 75 L65 75 L55 60 L60 60 L50 45 L40 60 L45 60 L35 75 L30 75 L40 60 L25 60 L25 55 L40 55 L30 40 L35 40 L45 25 L40 25 Z" />
        <path d="M50 10 L50 2.5 L45 2.5 L45 10 L50 10 M50 10 L55 10 L55 2.5 L50 2.5" />
        <path d="M50 90 L50 97.5 L55 97.5 L55 90 L50 90 M50 90 L45 90 L45 97.5 L50 97.5" />
    </SvgWrapper>
);

export const AgeOfSigmarLogo: React.FC = () => (
    <SvgWrapper>
        <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" />
        <path d="M50 25 L55 45 L75 50 L55 55 L50 75 L45 55 L25 50 L45 45 Z" fillOpacity="0.7" />
    </SvgWrapper>
);

export const OldWorldLogo: React.FC = () => (
    <SvgWrapper>
        <path d="M50 10 L65 25 L60 50 L75 65 L50 90 L25 65 L40 50 L35 25 Z" />
        <path d="M50 10 L50 40 M25 65 L75 65 M50 90 L50 60" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </SvgWrapper>
);

export const BattletechLogo: React.FC = () => (
    <SvgWrapper>
        <path d="M40 20 L60 20 L65 30 L60 40 L75 60 L70 80 L55 80 L50 70 L45 80 L30 80 L25 60 L40 40 L35 30 Z" />
        <rect x="45" y="15" width="10" height="5" />
        <path d="M30 80 L20 90 L80 90 L70 80" />
    </SvgWrapper>
);

export const StarWarsLegionLogo: React.FC = () => (
    <SvgWrapper>
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M50 15 L55 35 L75 40 L55 45 L50 65 L45 45 L25 40 L45 35 Z" />
        <path d="M15 75 L25 85 L75 85 L85 75 Z" />
    </SvgWrapper>
);

export const ShatterpointLogo: React.FC = () => (
    <SvgWrapper>
        <path d="M50 10 L90 50 L50 90 L10 50 Z" />
        <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="3" opacity="0.5" />
        <path d="M30 30 L70 70 M70 30 L30 70" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </SvgWrapper>
);

export const MarvelCrisisProtocolLogo: React.FC = () => (
    <SvgWrapper>
        <rect x="10" y="25" width="80" height="50" />
        <text x="50" y="62" fontSize="40" textAnchor="middle" fill="white" fontWeight="bold">MCP</text>
    </SvgWrapper>
);

export const MiddleEarthSBGLogo: React.FC = () => (
    <SvgWrapper>
        <path d="M50 90 L50 50 M50 50 C 70 50, 70 30, 50 30 C 30 30, 30 50, 50 50" fill="none" strokeWidth="4" stroke="currentColor" />
        <path d="M40 85 L60 85" />
        <path d="M35 80 L65 80" />
        <path d="M30 75 L70 75" />
        <path d="M35 50 L20 40 M65 50 L80 40" />
        <path d="M38 55 L25 65 M62 55 L75 65" />
    </SvgWrapper>
);

export const GenericSciFiLogo: React.FC = () => (
    <SvgWrapper>
        <path d="M50 10 L20 90 L80 90 Z" fill="none" stroke="currentColor" strokeWidth="5" />
        <circle cx="50" cy="65" r="10" />
        <path d="M10 30 L90 30 M20 60 L80 60" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    </SvgWrapper>
);

export const GenericFantasyLogo: React.FC = () => (
    <SvgWrapper>
        <path d="M20 80 L50 20 L80 80 L70 80 L60 60 L40 60 L30 80 Z" />
        <path d="M50 20 L50 10 M40 15 L60 15" stroke="currentColor" strokeWidth="4" />
    </SvgWrapper>
);
