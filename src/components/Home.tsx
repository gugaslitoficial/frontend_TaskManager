'use client';

import { IoIosBookmarks } from "react-icons/io";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

export default function Home() {
    const [query, setQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState('');
    const [username, setUsername] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [reminders, setReminders] = useState<any[]>([]);

    const navigate = useNavigate();

    const handleAddEventClick = () => {
        setShowForm(true);
    };

    useEffect(() => {
        // Função para buscar o nome do usuário logado
        const fetchUsername = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                console.log('Token:', token);
                if (!token) {
                    return navigate('/'); // Redireciona para login se o token não existir
                }
                const response = await fetch('http://localhost:3001/api/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Response Status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('User data:', data);
                    setUsername(data.username); // Define o nome do usuário
                } else {
                    console.error('Erro ao buscar o nome do usuário');
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        // Função para formatar a data
        const formatDate = () => {
            const today = new Date();
            const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            setCurrentDate(today.toLocaleDateString('pt-BR', options)); // Define a data formatada
        };

        fetchUsername(); // Busca o nome do usuário
        formatDate(); // Formata a data atual
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const newReminder = { title, date, category, description };
        console.log('Submitting:', newReminder);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Token não encontrado');
                return;
            }

            const response = await fetch('http://localhost:3001/api/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newReminder),
            });

            console.log('Response Status:', response.status);

            if (response.ok) {
                setSuccess('Lembrete adicionado com sucesso!');
                setTimeout(() => {
                    setShowForm(false);
                }, 2000);

                setTitle('');
                setDate('');
                setCategory('');
                setDescription('');
            } else {
                const errorData = await response.json();
                console.log('Error Response Data:', errorData);
                setError(errorData.message || 'Erro ao adicionar lembrete');
            }
        } catch (error) {
            console.error('Catch Error:', error);
            setError('Ocorreu um erro inesperado');
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (error) {
            timer = setTimeout(() => setError(null), 5000); // Limpar o erro após 5 segundos
        }
        return () => clearTimeout(timer); // Limpar o timer se o componente for desmontado
    }, [error]); // Dependente da variável `error`

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Token não encontrado');
                return;
            }
        
            const response = await fetch(`http://localhost:3001/api/reminders/search?title=${query}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (response.ok) {
                const data = await response.json();
                setReminders(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Erro ao buscar lembretes');
            }
        } catch (error) {
            setError('Ocorreu um erro inesperado');
        }
    
        if (error) {
            setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <div className='h-screen flex flex-col items-center w-full'>
            <div className='w-full h-1/6 bg-white shadow-lg p-5'>
                <div className="flex gap-3">
                    <h1 className='text-xl font-semibold gap-10'>Olá, {username}</h1>
                    <IoIosBookmarks className='w-7 h-7' />
                </div>
                <h2 className='py-2 text-sm font-semibold'>A data de hoje é: {currentDate}</h2>
                <div>
                    <h1 onClick={handleLogout} className='cursor-pointer text-red-800 font-semibold pt-4'>Logout</h1>
                </div>
            </div>
            <div className='border-2 w-full h-full flex flex-col items-center py-20'>
                <div className='flex flex-col w-full h-full items-center'>
                    {!showForm ? (
                        <div className='flex flex-col w-full'>
                            <div className="flex items-center justify-center">
                                <button 
                                    className='flex gap-1p-2 w-auto bg-blue-500 hover:bg-blue-600 text-white rounded-r px-4 py-2 shadow shadow-black font-semibold'
                                    onClick={handleAddEventClick}
                                >
                                    <IoMdAddCircleOutline className="w-6 h-6"/>Add New Event
                                </button>
                            </div>

                            <form className='flex items-center justify-center py-16 w-full'>
                                <IoSearch className="w-8 h-8 mr-2"/>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Pesquisar..."
                                    className='border border-gray-200 rounded-l px-4 py-2 w-1/3 shadow'
                                />
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className='bg-blue-500 hover:bg-blue-600 text-white rounded-r shadow px-4 py-2'
                                >
                                    Buscar
                                </button>
                            </form>
                            {/* Exibir resultados da pesquisa */}
                        {reminders.length > 0 ? (
                            <div className='flex justify-center gap-5 '>
                                {reminders.map((reminder) => (
                                    <div
                                        key={reminder.id}
                                        className="w-1/5 bg-white shadow-lg rounded-lg p-5 border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl"
                                    >
                                        <h2 className="text-xl font-semibold mb-2">{reminder.title}</h2>
                                        <p className="text-gray-600 mb-2">Data: {new Date(reminder.date).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Categoria: <span className="font-medium text-blue-500">{reminder.category}</span>
                                        </p>
                                        <p className="text-gray-700">{reminder.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 text-xl">Nenhum resultado encontrado.</p>
                        )}
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    ) : (
                        <form 
                            onSubmit={handleSubmit} 
                            className='flex flex-col gap-4 w-1/2'>
                            <label 
                                htmlFor='title'
                                className='font-semibold'>Event Title:</label>
                            <input 
                                id='title'
                                name="title"
                                type='text' 
                                className='border-2 p-2' 
                                placeholder='Enter event title' 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <label
                                htmlFor='date' 
                                className='font-bold'>Event Date:</label>
                            <input 
                                id='date'
                                name="date"
                                type='date' 
                                className='border-2 p-2'
                                value={date}
                                onChange={(e) => setDate(e.target.value)} 
                            />

                            <label 
                                htmlFor='category'
                                className='font-bold'>Category:</label>
                            <select 
                                id='category'
                                name="category"
                                className='border-2 p-2'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value='None'>None</option>
                                <option value='Task'>Task</option>
                                <option value='Reminder'>Reminder</option>
                                <option value='Event'>Event</option>
                            </select>

                            <label 
                                htmlFor='description' 
                                className='font-bold'>Description:</label>
                            <textarea 
                                id='description'
                                name="description"
                                rows={4}
                                className='border-2 p-2'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                             {error && <p className="text-red-500 mb-5">{error}</p>}
                             {success && <p className="text-green-500 mb-5">{success}</p>}

                            <div className='flex justify-center gap-2'>
                                <button 
                                    type='submit'
                                    className='bg-blue-500 text-white px-4 py-2 rounded'
                                >
                                    Save Event
                                </button>
                                <button 
                                    type='button' 
                                    className='bg-gray-500 text-white px-4 py-2 rounded'
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}