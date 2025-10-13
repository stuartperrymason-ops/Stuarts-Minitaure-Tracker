/**
 * @file src/components/ImageGalleryModal.tsx
 * This component displays a modal with a carousel for viewing a miniature's images.
 */

import React, { useState, useEffect } from 'react';
import { Miniature } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from './Icons';
import ReactDOM from 'react-dom';

// Defines the props for the ImageGalleryModal component.
interface ImageGalleryModalProps {
    miniature: Miniature;
    onClose: () => void;
}

/**
* A modal dialog for viewing an image gallery for a single miniature.
* @param {ImageGalleryModalProps} props The component's properties.
* @returns {JSX.Element} The rendered modal component.
*/
const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ miniature, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = miniature.images || [];

    // Keyboard navigation effect
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, images.length]); // Re-bind if index or images change

    if (images.length === 0) {
        return null; // Don't render if there are no images.
    }
    
    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    
    const goToIndex = (index: number) => {
        setCurrentIndex(index);
    };

    const modalContent = (
        <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-[100] p-4 animate-fade-in"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-opacity-70 hover:text-opacity-100 transition-opacity"
                aria-label="Close gallery"
            >
                <XIcon />
            </button>
            
            {/* Main Content */}
            <div className="relative w-full h-full max-w-5xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-white text-center text-xl mb-4 truncate">{miniature.modelName}</h2>

                {/* Main Image Viewer */}
                <div className="relative flex-grow flex items-center justify-center">
                    <img 
                        src={images[currentIndex]} 
                        alt={`Image ${currentIndex + 1} for ${miniature.modelName}`}
                        className="max-w-full max-h-full object-contain"
                    />
                    
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={goToPrevious}
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                                aria-label="Previous image"
                            >
                                <ChevronLeftIcon />
                            </button>
                            <button 
                                onClick={goToNext}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                                aria-label="Next image"
                            >
                                <ChevronRightIcon />
                            </button>
                        </>
                    )}
                </div>

                 {/* Filmstrip/Thumbnails */}
                {images.length > 1 && (
                    <div className="flex-shrink-0 mt-4 h-24">
                        <div className="flex justify-center items-center gap-2 overflow-x-auto p-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToIndex(index)}
                                    className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${
                                        index === currentIndex ? 'border-4 border-cyan-400' : 'border-2 border-transparent hover:border-gray-500'
                                    }`}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    let modalRoot = document.getElementById('gallery-modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'gallery-modal-root';
        document.body.appendChild(modalRoot);
    }
    
    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default ImageGalleryModal;