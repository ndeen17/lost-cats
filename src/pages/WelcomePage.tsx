import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Non.png';
import axios from 'axios';

const WelcomePage = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Check for existing username in local storage on component mount
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            navigate('/dashboard'); // Redirect to dashboard if user is already signed in
        }
    }, [navigate]);

    const handleSignIn = async () => {
        if (!username) {
            setError("Username cannot be empty");
            return;
        }

        try {
            // Removed the check for duplicates/reserved usernames
            // Call the backend to save user info
            await axios.post(`${import.meta.env.VITE_API_URL}/users`, { userName: username }); // Changed 'username' to 'userName'
            // Store the username in local storage
            localStorage.setItem('username', username);
            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError("Failed to sign in. Try again.");
        }
    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#7d0000',
            color: '#fff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <img src={logo} alt="logo" style={{ maxWidth: '200px', height: 'auto' }} />
            <h1>Welcome to the Game!</h1>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: '10px', margin: '10px 0', borderRadius: '5px' }}
            />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button onClick={handleSignIn} style={{
                color: '#fff',
                backgroundColor: '#00f',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
            }}>
                Sign In
            </button>
        </div>
    );
};

export default WelcomePage;
