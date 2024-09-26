import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // Import UserContext hook
import logo from '../assets/Non.png';

const WelcomePage = () => {
    const [localUsername, setLocalUsername] = useState<string | null>(null);
    const { setUserName } = useUser(); // Get setUserName from context to store in global state

    useEffect(() => {
        // Optional chaining to ensure compatibility if not opened in Telegram
        const tg = window.Telegram?.WebApp;
        let username = 'Guest'; // Default username
        if (tg?.initDataUnsafe?.user) {
            username = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
        }

        setLocalUsername(username); // Set the local state for immediate display
        setUserName(username); // Save the username in the context for global use
        localStorage.setItem('userName', username); // Optionally store in localStorage
    }, [setUserName]);

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
            {/* Display the logo */}
            <div style={{ marginBottom: '20px'}}>
                <img src={logo} alt="logo" style={{ minWidth: '100px', maxWidth: '200px', height: 'auto' }} />
            </div>
            <h1 style={{ 
                fontSize: '6vw', 
                margin: '20px 0', 
                lineHeight: '1.2' 
            }}>
                Welcome, {localUsername}!
            </h1>
            <p style={{ 
                fontSize: '4vw', 
                margin: '10px 0 20px' 
            }}>
                We're glad to have you here. Explore your tasks and start earning CTS!
            </p>
            <div style={{ marginTop: '40px' }}>
                <a 
                    href="/dashboard" 
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
