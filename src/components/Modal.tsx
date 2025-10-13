/**
 * @file src/components/Modal.tsx
 * A reusable modal dialog component that renders its content on top of the rest of the page.
 * It uses a React Portal to attach itself to the document body, ensuring it appears above other elements.
 */

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Theme } from '../themes';
import { XIcon } from './Icons';

// Defines the props for the Modal component.
interface ModalProps {
    onClose: () => void; // Callback function to close the modal.
    children: React.ReactNode; // The content to be displayed inside the modal.
    title: string; // The title displayed in the modal's header.
    theme: Theme; // The active theme object for styling.
}

/**
 * A generic Modal component.
 * @param {ModalProps} props The properties passed to the component.
 * @returns {React.ReactPortal} A React Portal rendering the modal.
 */
const Modal: React.FC<ModalProps> = ({ onClose, children, title, theme }) => {
    
    // `useEffect` sets up and cleans up a global event listener.
    useEffect(() => {
        // This function handles the 'keydown' event to close the modal when the Escape key is pressed.
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        // Add the event listener to the window.
        window.addEventListener('keydown', handleEsc);
        
        // The return function from `useEffect` is a cleanup function.
        // It's called when the component unmounts, preventing memory leaks by removing the event listener.
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]); // The dependency array ensures the effect is set up only once.

    const modalContent = (
        // The outer div is the modal backdrop. Clicking it will trigger `onClose`.
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            {/* The inner div is the modal content itself. */}
            {/* `e.stopPropagation()` prevents a click inside the modal from bubbling up and closing it. */}
            <div 
                className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-gray-700 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className={`flex justify-between items-center p-4 border-b border-gray-700`}>
                    <h2 className={`text-xl font-bold ${theme.primaryText}`}>{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>
                {/* Modal Body: The content passed as `children` is rendered here. */}
                {children}
            </div>
        </div>
    );
    
    // This is the logic for the React Portal.
    // It finds or creates a specific div (`#modal-root`) in the main HTML document
    // and tells React to render `modalContent` inside of it.
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
    }
    
    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;
