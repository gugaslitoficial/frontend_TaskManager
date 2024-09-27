'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Definição dos tipos para os lembretes
interface Reminder {
    id: number;
    title: string;
    date: string; // Formato: 'YYYY-MM-DD'
    category: string;
    description: string;
}

// Tipos conforme o exemplo do react-calendar
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarComponent() {
    const [events, setEvents] = useState<{ [key: string]: Reminder[] }>({});
    const [selectedDate, setSelectedDate] = useState<Value>(new Date());

    useEffect(() => {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const fetchReminders = async () => {
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
                    const data: Reminder[] = await response.json();

                    // Organizar lembretes por data
                    const eventsMap: { [key: string]: Reminder[] } = {};
                    data.forEach((reminder: Reminder) => {
                        const date = new Date(reminder.date).toISOString().split('T')[0]; // Converte a data para 'YYYY-MM-DD'
                        if (!eventsMap[date]) {
                            eventsMap[date] = [];
                        }
                        eventsMap[date].push(reminder);
                    });
                    setEvents(eventsMap);
                } else {
                    console.log('Erro ao buscar lembretes');
                }
            } catch (error) {
                console.log('Erro ao buscar lembretes:', error);
            }
        };

        fetchReminders();
    }, []);

    // Ajusta a função handleDateChange para aceitar os tipos corretos
    const handleDateChange = (value: Value) => {
        setSelectedDate(value);
    };

    const formatDate = (date: Date | Date[] | null): string => {
        if (date instanceof Date) {
            return date.toISOString().split('T')[0]; // Retorna no formato 'YYYY-MM-DD'
        }
        return '';
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Calendário de Lembretes</h1>
            <div className="flex justify-center">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    view="month"
                    className="react-calendar"
                />
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Lembretes do Dia</h2>
                <div>
                    {events[formatDate(selectedDate as Date)] ? (
                        events[formatDate(selectedDate as Date)].map(reminder => (
                            <div key={reminder.id} className="mb-4 p-4 bg-white shadow-md rounded-lg border border-gray-300">
                                <h3 className="text-lg font-semibold">{reminder.title}</h3>
                                <p className="text-gray-600">Data: {new Date(reminder.date).toLocaleDateString()}</p>
                                <p className="text-gray-700">{reminder.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum lembrete para este dia.</p>
                    )}
                </div>
            </div>
        </div>
    );
}