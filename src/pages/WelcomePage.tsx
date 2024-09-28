import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import { useUser } from '../context/UserContext'; // Import user context
import logo from '../assets/Non.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const WelcomePage = () => {
    const { userName } = useUser(); // Get username from context
    const [ctsBalance, setCtsBalance] = useState<number>(0); // State for CTS balance
    const [error, setError] = useState<string | null>(null); // Error state
    const navigate = useNavigate(); // Initialize navigate for routing

    // Fetch user data directly from the backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('API URL:', import.meta.env.VITE_API_URL); // Log API URL for debugging

                // Fetch user data using the username from context
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userName}`);
                setCtsBalance(res.data.ctsBalance); // Set the CTS balance from response
                
                // Redirect to dashboard after successfully fetching user data
                navigate('/dashboard');
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load user data."); // Set error message
            }
        };

        fetchUserData();
    }, [userName, navigate]); // Run when userName changes

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
                Welcome, {userName}!
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
