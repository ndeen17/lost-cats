import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import logo from '../assets/Non.png';

const WelcomePage = () => {
    const [username, setUsername] = useState<string | null>(null); // State for username
    const [ctsBalance, setCtsBalance] = useState<number>(0); // State for CTS balance
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch user data directly from the backend using a fixed username or ID
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Replace 'username' with the actual value you are using for identification
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/USERNAME_OR_CHATID`);
                setUsername(res.data.userName); // Set the username from response
                setCtsBalance(res.data.ctsBalance); // Set the CTS balance from response
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load user data.");
            }
        };

        fetchUserData(); // Call the function to fetch user data on page load
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
                    href="/dashboard" // Redirect to the dashboard
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
                    Go to Dashboard
                </a>
            </div>
        </div>
    );
};

export default WelcomePage;
