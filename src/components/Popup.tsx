// components/Popup.tsx

import React from 'react';

interface PopupProps {
    event: {
        id: number;
        title: string;
        date: string;
        category: string;
        description: string;
    };
    position: {
        top: number;
        left: number;
    };
    onClose: () => void;
    onDelete: (id: number) => Promise<void>; // Certifique-se de incluir esta propriedade
}

const Popup: React.FC<PopupProps> = ({ event, position, onClose, onDelete }) => {
    return (
        <div
            className="fixed bg-white shadow-lg rounded-lg p-6 border border-gray-300"
            style={{ top: position.top, left: position.left }}
        >
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-4">Data: {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 mb-2">
                Categoria: <span className="font-medium text-blue-500">{event.category}</span>
            </p>
            <p className="text-gray-700">{event.description}</p>
            <button
                onClick={() => onDelete(event.id)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
                Excluir
            </button>
            <button
                onClick={onClose}
                className="mt-4 ml-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            >
                Fechar
            </button>
        </div>
    );
};

export default Popup;