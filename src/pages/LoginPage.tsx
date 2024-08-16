// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [name, setName] = useState('');
    const { setUserName } = useUser();
    const navigate = useNavigate();

    const handleLogin = () => {
        setUserName(name);
        localStorage.setItem('userName', name); // Persisting user name
        navigate('/dashboard');
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Welcome! Please enter your name</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #000' }}
            />
            <button
                onClick={handleLogin}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Start Playing
            </button>
        </div>
    );
};

export default LoginPage;
