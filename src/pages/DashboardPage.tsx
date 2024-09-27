import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import FarmButton from '../components/FarmButton'; // Import FarmButton component
import logo from '../assets/logo.png';

const DashboardPage = () => {
    const [userName, setUserName] = useState<string | null>(null); // State for user name
    const [ctsBalance, setCtsBalance] = useState<number | undefined>(undefined); // State for CTS balance
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (tg && tg.initDataUnsafe?.user) {
            const chatId = tg.initDataUnsafe.user.id; // Get chat ID
            const username = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
            setUserName(username); // Set user name

            // Fetch user data from the backend
            const fetchUserData = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${chatId}`);
                    setCtsBalance(res.data.ctsBalance); // Set CTS balance
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError("Failed to load user data.");
                }
            };

            fetchUserData(); // Call the fetch function
        } else {
            console.warn('No Telegram user data found.');
            setUserName('Guest'); // Fallback username
        }
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
            {/* Display the logo */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
            </div>

            {/* Displaying user name */}
            {userName ? (
                <h1 style={{ textAlign: 'center', fontSize: '28px', margin: '20px 0' }}>Hello, {userName}!</h1>
            ) : (
                <h2 style={{ textAlign: 'center', fontSize: '28px', margin: '20px 0' }}>Loading...</h2> // Show loading state if userName is not yet available
            )}
            
            {/* Displaying CTS balance */}
            <h2 style={{ textAlign: 'center', fontSize: '22px', margin: '20px 0' }}>
                Your CTS Balance: {ctsBalance !== undefined ? ctsBalance : 'Loading...'} {/* Show loading state for balance if needed */}
            </h2>

            {/* Display the FarmButton */}
            {error ? (
                <div style={{ color: 'red', textAlign: 'center' }}>{error}</div> // Display error if exists
            ) : (
                <FarmButton /> // Replacing TaskSlider with FarmButton
            )}
        </div>
    );
};

export default DashboardPage;
