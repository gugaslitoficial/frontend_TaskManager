'use client'

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiBaseUrl = "https://backend-taskmanager-x0d7.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Erro de rede. Tente novamente.');
    }
  };

    return (
        //Estilização visual do "Login" e demais atualizações que também serão funcionais:
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="w-1/3 h-auto p-16 bg-gray-800 rounded-lg shadow-sm shadow-white">
          <div className="flex flex-col items-center justify-center gap-10">
            <h1 className="text-white text-5xl font-bold mb-10">Login</h1>
            <form onSubmit={handleLogin} className='flex flex-col h-full w-full gap-5'>
                <input 
                id='login-email' 
                className=" w-full p-2 mb-5" 
                placeholder="E-mail" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required />
                <input 
                id='login-password' 
                className=" w-full p-2" 
                placeholder="Senha" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required />
                {error && <p className="text-red-500 mb-5">{error}</p>}
              <div className="flex w-full justify-center items-center gap-10 mb-5">
                <button 
                type="submit" 
                className=" p-2 w-1/4 mt-2 text-white bg-blue-600 cursor-pointer hover:bg-blue-800">Sign In</button>
                <button 
                type="button" 
                className=" p-2 w-1/4 mt-2 text-white bg-blue-600 cursor-pointer hover:bg-blue-800" 
                onClick={() => navigate('/register')}>Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}