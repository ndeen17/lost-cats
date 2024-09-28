import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import logo from '../assets/Non.png';

const Dashboard = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [ctsBalance, setCtsBalance] = useState<number>(0); // State for CTS balance
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        // Assuming you're passing the username or chatId as a URL param or through some state management
        const fetchUserData = async () => {
            if (!username) return; // Only fetch if username is available

            try {
                // Replace 'username' with whatever unique identifier (like chatId) you're using
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${username}`);
                setCtsBalance(res.data.ctsBalance); // Set CTS balance
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load user data.");
            }
        };

        fetchUserData(); // Fetch user data
    }, [username]);

    // Fetch the username or chatId when the component is mounted
    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (tg && tg.initDataUnsafe?.user) {
            // Set the username based on Telegram's data (or you can use chatId here if preferred)
            const user = tg.initDataUnsafe.user;
            const username = user.username || user.first_name;
            setUsername(username);
        } else {
            console.warn('No Telegram user data found.');
            setUsername('Guest'); // Fallback username
        }
    }, []);

    return (
        <div style={{ 
            padding: '20px', 
            backgroundColor: '#121212', 
            color: '#fff', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <img src={logo} alt="logo" style={{ minWidth: '100px', maxWidth: '200px', height: 'auto' }} />
            </div>
            <h1 style={{ fontSize: '6vw', margin: '20px 0', lineHeight: '1.2' }}>
                Welcome, {username}!
            </h1>
            <p style={{ fontSize: '4vw', margin: '10px 0 20px' }}>
                Your current balance: {ctsBalance} CTS
            </p>
            {error && (
                <div style={{ color: 'red', fontSize: '3vw' }}>{error}</div>
            )}
            <div style={{ marginTop: '40px' }}>
                <a 
                    href="/tasks" // Link to your tasks page
                    style={{
                        color: '#fff',
                        backgroundColor: '#00f',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        fontSize: '4vw',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0057e7')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00f')}
                >
                    View Tasks
                </a>
            </div>
        </div>
    );
};

export default Dashboard;
