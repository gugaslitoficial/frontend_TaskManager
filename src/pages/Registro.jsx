'use client'

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const apiBaseUrl = process.env.API_BASE_URL;

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log('API Base URL:', apiBaseUrl);
    try {
      const response = await fetch(`${apiBaseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setSuccess('Cadastro realizado com sucesso!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao cadastrar');
      }
    } catch (error) {
      setError('Ocorreu um erro inesperado');
    }
  };

  const handleExit = () => {
    navigate('/');
  };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="w-1/3 h-auto p-16 bg-gray-800 rounded-lg shadow-sm shadow-white">
          <div className="flex flex-col items-center justify-center gap-10">
            <h1 className="text-white text-5xl font-bold mb-10">Sign Up</h1>
            <form onSubmit={handleRegister} className="w-full flex flex-col gap-10">
              <input 
              className=" w-full p-2 " 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              />
              <input 
              className=" w-full p-2 " 
              placeholder="E-mail" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              />
              <input 
              className=" w-full p-2 " 
              placeholder="Password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              />
              {error && <p className="text-red-500 mb-5">{error}</p>}
              {success && <p className="text-green-500 mb-5">{success}</p>}
                <div className="flex w-full justify-center items-center gap-10 mb-5">
                  <button 
                  type="submit" 
                  className=" p-2 w-1/4 mt-2 text-white bg-blue-600 cursor-pointer hover:bg-blue-800">Sign Up</button>
                  <button 
                  type="button" 
                  className=" p-2 w-1/4 mt-2 text-white bg-blue-600 cursor-pointer hover:bg-blue-800"
                  onClick={handleExit}>Exit</button>
                </div>
              </form>
          </div>
        </div>
      </div>
    )
}