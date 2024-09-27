'use client'

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../components/menuLateral';
import Calendar from '../components/Calendar';
import Task from '../components/Tasks';
import Lembretes from '../components/Lembretes';
import Home from '../components/Home';

export default function Dashboard() {
    const [activeComponent, setActiveComponent] = useState('home');
    const [reminders, setReminders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const updateReminders = (newReminder) => {
        setReminders(newReminder);
    };
    

    const renderContent = () => {
        switch (activeComponent) {
            case 'calendar':
                return <Calendar />;
            case 'task':
                return <Task />;
            case 'lembretes':
                return <Lembretes reminders={reminders} />;
            default:
                return <Home updateReminders={updateReminders} />;
        }
    };

    return (
        <div className='flex'>
            <MenuLateral setActiveComponent={setActiveComponent} />
            <div className='w-4/5'>
                {renderContent()}
            </div>
        </div>
    );
}
