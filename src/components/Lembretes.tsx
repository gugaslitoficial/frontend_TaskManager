'use client';

import React, { useEffect, useState } from 'react';

interface Reminder {
    id: number;
    title: string;
    date: string;
    category: string;
    description: string;
}

export default function Lembretes() {
    const [reminders, setReminders] = useState<Reminder[]>([]);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('Token não encontrado');
                    return;
                }

                const response = await fetch('http://localhost:3001/api/reminders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: Reminder[] = await response.json();
                    // Filtrar lembretes com categoria 'Reminder'
                    const filteredReminders = data.filter(reminder => reminder.category === 'Reminder');
                    setReminders(filteredReminders);
                } else {
                    console.log('Erro ao buscar lembretes');
                }
            } catch (error) {
                console.log('Erro ao buscar lembretes:', error);
            }
        };

        fetchReminders();
    }, []);

    const deleteReminder = async (id: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const response = await fetch(`http://localhost:3001/api/reminders/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Remover o lembrete do estado local após a exclusão bem-sucedida
                setReminders(reminders.filter(reminder => reminder.id !== id));
                console.log('Lembrete excluído com sucesso');
            } else {
                console.log('Erro ao excluir lembrete');
            }
        } catch (error) {
            console.log('Erro ao excluir lembrete:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Meus Lembretes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reminders.length > 0 ? (
                    reminders.map((reminder) => (
                        <div
                            key={reminder.id}
                            className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl"
                        >
                            <h2 className="text-xl font-semibold mb-2">{reminder.title}</h2>
                            <p className="text-gray-600 mb-4">Data: {new Date(reminder.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500 mb-2">
                                Categoria: <span className="font-medium text-blue-500">{reminder.category}</span>
                            </p>
                            <p className="text-gray-700">{reminder.description}</p>
                            <button
                                onClick={() => deleteReminder(reminder.id)}
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                            >
                                Excluir
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-xl">Nenhum lembrete encontrado.</p>
                )}
            </div>
        </div>
    );
}