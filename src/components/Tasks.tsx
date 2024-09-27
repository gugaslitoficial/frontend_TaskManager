'use client';

import React, { useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    date: string;
    category: string;
    description: string;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('Token não encontrado');
                    return;
                }

                const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
                const response = await fetch(`${apiBaseUrl}/api/reminders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: Task[] = await response.json();
                    // Filtrar tarefas com categoria 'Task'
                    const filteredTasks = data.filter(task => task.category === 'Task');
                    setTasks(filteredTasks);
                } else {
                    console.log('Erro ao buscar tarefas');
                }
            } catch (error) {
                console.log('Erro ao buscar tarefas:', error);
            }
        };

        fetchTasks();
    }, []);

    const deleteTask = async (id: number) => {
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
                // Remover a tarefa do estado local após a exclusão bem-sucedida
                setTasks(tasks.filter(task => task.id !== id));
                console.log('Tarefa excluída com sucesso');
            } else {
                console.log('Erro ao excluir tarefa');
            }
        } catch (error) {
            console.log('Erro ao excluir tarefa:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Minhas Tarefas</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl"
                        >
                            <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                            <p className="text-gray-600 mb-4">Data: {new Date(task.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500 mb-2">
                                Categoria: <span className="font-medium text-blue-500">{task.category}</span>
                            </p>
                            <p className="text-gray-700">{task.description}</p>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                            >
                                Excluir
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-xl">Nenhuma tarefa encontrada.</p>
                )}
            </div>
        </div>
    );
}