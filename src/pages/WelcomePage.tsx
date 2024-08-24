import React, { useEffect, useState } from 'react';

const WelcomePage = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Optional chaining to ensure compatibility if not opened in Telegram
        const tg = window.Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user) {
            setUsername(tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name);
        } else {
            setUsername('Guest');
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
            <h1 style={{ 
                fontSize: '6vw', 
                margin: '20px 0', 
                lineHeight: '1.2' 
            }}>
                Welcome, {username}!
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
