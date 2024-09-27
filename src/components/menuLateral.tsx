// components/MenuLateral.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Popup from './Popup'; // Importe o componente Popup

interface MenuLateralProps {
    setActiveComponent: (component: string) => void;
}

interface EventReminder {
    id: number;
    title: string;
    date: string;
    category: string;
    description: string;
}

export default function MenuLateral({ setActiveComponent }: MenuLateralProps) {
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [eventTitles, setEventTitles] = useState<EventReminder[]>([]);
    const [isPrivadoOpen, setIsPrivadoOpen] = useState(true); // Inicialmente aberto
    const [selectedEvent, setSelectedEvent] = useState<EventReminder | null>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

    const fetchUserImage = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${apiBaseUrl}/api/user/image`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setImage(imageUrl);
            } else {
                console.log('Erro ao buscar imagem');
            }
        } catch (error) {
            console.log('Erro ao buscar imagem:', error);
        }
    };

    useEffect(() => {
        fetchUserImage();
    }, []);

    // Função para fazer upload da nova imagem
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${apiBaseUrl}/api/user/upload-image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                // Forçar atualização da imagem
                fetchUserImage();
            } else {
                console.log('Erro ao fazer upload da imagem');
            }
        } catch (error) {
            console.log('Erro ao fazer upload da imagem:', error);
        }
    };    

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const fetchEventReminders = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('Token não encontrado');
                    return;
                }

                const response = await fetch(`${apiBaseUrl}/api/reminders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: EventReminder[] = await response.json();
                    const eventReminders = data.filter(reminder => reminder.category === 'Event');
                    setEventTitles(eventReminders);
                    console.log('Event titles fetched:', eventReminders);
                } else {
                    console.log('Erro ao buscar lembretes');
                }
            } catch (error) {
                console.log('Erro ao buscar lembretes:', error);
            }
        };

        fetchEventReminders();
    }, []);

    const handleEventClick = (event: EventReminder, eventTarget: HTMLLIElement) => {
        setSelectedEvent(event);
        const rect = eventTarget.getBoundingClientRect();
        // Ajusta a posição do popup para aparecer ao lado do menu lateral
        setPopupPosition({
            top: rect.top + window.scrollY,
            left: rect.right + window.scrollX
        });
        setPopupVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${apiBaseUrl}/api/reminders/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Atualizar a lista de eventos conforme necessário
                setEventTitles(prevEvents => prevEvents.filter(event => event.id !== id));
                setSelectedEvent(null); // Fechar o popup
                console.log('Evento excluído com sucesso');
            } else {
                console.log('Erro ao excluir evento');
            }
        } catch (error) {
            console.log('Erro ao excluir evento:', error);
        }
    };

    return (
        <div className='border-black border-1-4 shadow-2xl shadow-black h-screen w-2/12 flex flex-col py-5 relative'>
            <div className='h-1/6 w-full flex'>
                <div className='h-full w-1/2 flex items-center justify-center'>
                    <div
                        onClick={handleDivClick}
                        className="w-36 h-36 rounded-full overflow-hidden bg-gray-200 cursor-pointer flex items-center justify-center border-black border-2"
                    >
                        {image ? (
                            <img
                                src={image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-500">Click to upload</span>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                    />
                </div>
                <div className='h-full w-1/2 flex flex-col items-center justify-center '>
                </div>
            </div>
            <div>
                <ul className='h-full w-full flex flex-col pt-10'>
                    <li className='font-bold text-2xl pl-4'>
                        <button
                            className='w-full text-left px-4 py-2 hover:bg-gray-200 focus:outline-none'
                            onClick={() => setIsPrivadoOpen(!isPrivadoOpen)}
                        >
                            Principal
                        </button>
                        {isPrivadoOpen && (
                            <ul className='pl-4 font-semibold text-xl'>
                                <li onClick={() => setActiveComponent('home')} className='cursor-pointer hover:text-blue-600'>Home</li>
                                <li onClick={() => setActiveComponent('calendar')} className='cursor-pointer hover:text-blue-600'>Calendário</li>
                                <li onClick={() => setActiveComponent('task')} className='cursor-pointer hover:text-blue-600'>Tarefas</li>
                                <li onClick={() => setActiveComponent('lembretes')} className='cursor-pointer hover:text-blue-600'>Lembretes</li>
                            </ul>
                        )}
                    </li>
                    <li className='font-bold text-2xl pt-4 pl-4'>
                        <button
                            className='w-full text-left px-4 py-2 hover:bg-gray-200 focus:outline-none'
                            onClick={() => setIsPrivadoOpen(!isPrivadoOpen)}
                        >
                            Eventos
                        </button>
                        {isPrivadoOpen && (
                            <ul className='pl-4 font-semibold text-xl'>
                                {eventTitles.length > 0 ? (
                                    eventTitles.map((event) => (
                                        <li
                                            key={event.id}
                                            onClick={(e) => handleEventClick(event, e.currentTarget)}
                                            className='cursor-pointer hover:text-blue-600'
                                        >
                                            {event.title}
                                        </li>
                                    ))
                                ) : (
                                    <li>Nenhum evento encontrado.</li>
                                )}
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
            {popupVisible && selectedEvent && popupPosition && (
                <Popup
                    event={selectedEvent}
                    position={popupPosition}
                    onClose={() => setPopupVisible(false)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}