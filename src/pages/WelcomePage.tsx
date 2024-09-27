import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // Import UserContext hook
import logo from '../assets/Non.png';

const Dashboard = () => {
    const { userName, ctsBalance } = useUser(); // Get username and ctsBalance from context
    const [localUsername, setLocalUsername] = useState<string | null>(userName || null); // Default to context value

    useEffect(() => {
        const tg = window.Telegram?.WebApp; // Use optional chaining to access WebApp

        if (tg && tg.initDataUnsafe?.user) {
            const username = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
            setLocalUsername(username); // Update local username if available
        } else {
            // If no Telegram user is found, you can handle it here (e.g., redirect or show a message)
            console.warn('No Telegram user data found.');
            setLocalUsername('Guest'); // Fallback username
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
            <div style={{ marginBottom: '20px'}}>
                <img src={logo} alt="logo" style={{ minWidth: '100px', maxWidth: '200px', height: 'auto' }} />
            </div>
            <h1 style={{ fontSize: '6vw', margin: '20px 0', lineHeight: '1.2' }}>
                Welcome, {localUsername}!
            </h1>
            <p style={{ fontSize: '4vw', margin: '10px 0 20px' }}>
                Your current balance: {ctsBalance} CTS
            </p>
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
