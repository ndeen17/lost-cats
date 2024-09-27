import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // Import UserContext hook
import logo from '../assets/Non.png';

const WelcomePage = () => {
    const [localUsername, setLocalUsername] = useState<string | null>(null);
    const [inputName, setInputName] = useState<string>(''); // State for input name
    const { setUserName } = useUser(); // Get setUserName from context to store in global state
    const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false); // State to control prompt visibility

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        let username = 'Guest'; // Default username

        if (tg?.initDataUnsafe?.user) {
            username = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
            setUserName(username); // Save the username in the context for global use
            localStorage.setItem('userName', username); // Optionally store in localStorage
        } else {
            setIsPromptVisible(true); // Show prompt if no Telegram user is found
        }

        setLocalUsername(username); // Set the local state for immediate display
    }, [setUserName]);

    const handleNameSubmit = () => {
        if (inputName) {
            setLocalUsername(inputName); // Set the local username
            setUserName(inputName); // Save the username in the context
            localStorage.setItem('userName', inputName); // Store in localStorage
            setIsPromptVisible(false); // Hide the prompt
        }
    };

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

            {isPromptVisible ? (
                <>
                    <h2 style={{ marginBottom: '20px' }}>Please enter your name:</h2>
                    <input
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        style={{ padding: '10px', fontSize: '16px', width: '200px' }}
                    />
                    <button 
                        onClick={handleNameSubmit}
                        style={{
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: '#00f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Submit
                    </button>
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default WelcomePage;
