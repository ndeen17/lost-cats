import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // Import UserContext hook
import logo from '../assets/Non.png';

const Dashboard = () => {
    const { userName, ctsBalance, setUserName } = useUser(); // Get username, ctsBalance from context and setUserName
    const [localUsername, setLocalUsername] = useState<string | null>(userName || localStorage.getItem('userName') || 'Guest');
    const [inputName, setInputName] = useState<string>(''); // State for input name
    const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false); // Show prompt if username is missing

    // Prompt user to enter name if not available
    useEffect(() => {
        if (!userName && !localStorage.getItem('userName')) {
            setIsPromptVisible(true); // Show name input prompt
        }
    }, [userName]);

    const handleNameSubmit = () => {
        if (inputName.trim()) {
            setLocalUsername(inputName); // Set the local username
            setUserName(inputName); // Save the username in the context
            localStorage.setItem('userName', inputName); // Optionally store in localStorage
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
                </>
            )}
        </div>
    );
};

export default Dashboard;
