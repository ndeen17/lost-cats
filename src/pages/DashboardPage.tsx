import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import logo from '../assets/Non.png';

const Dashboard = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [ctsBalance, setCtsBalance] = useState<number | null>(null); // State for CTS balance
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        const fetchUserData = async () => {
            // Attempt to retrieve username from local storage
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                try {
                    // Fetch user data from backend using stored username
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${storedUsername}`);
                    setUsername(res.data.userName); // Set username from response
                    setCtsBalance(res.data.ctsBalance); // Set CTS balance from response
                    localStorage.setItem('username', res.data.userName); // Store username in local storage
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError("Failed to load user data.");
                }
            } else {
                setError("No username found in local storage.");
            }
        };

        fetchUserData(); // Fetch user data
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
                Welcome, {username || 'Guest'}!
            </h1>
            {ctsBalance !== null && (
                <p style={{ fontSize: '4vw', margin: '10px 0 20px' }}>
                    Your current balance: {ctsBalance} CTS
                </p>
            )}
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
