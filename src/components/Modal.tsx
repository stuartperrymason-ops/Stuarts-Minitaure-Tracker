import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Theme } from '../themes';
import { XIcon } from './Icons';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    theme: Theme;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, title, theme }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const modalContent = (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-gray-700 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex justify-between items-center p-4 border-b border-gray-700`}>
                    <h2 className={`text-xl font-bold ${theme.primaryText}`}>{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
    
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
    }
    
    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;
