// src/pages/DashboardPage.tsx
import React from 'react';
import Clicker from '../components/Clicker'; // Import Clicker component
import GuessingGame from '../components/GuessingGame'; // Import GuessingGame component
import { useUser } from '../context/UserContext'; // Import useUser hook from context

const DashboardPage = () => {
    const { userName, ctsBalance } = useUser(); // Access userName and ctsBalance from context

    return (
        <div style={{ padding: '20px' }}>
            {/* Displaying user name */}
            <h1 style={{ textAlign: 'center' }}>Hello, {userName}</h1>
            
            {/* Displaying CTS balance */}
            <h2 style={{ textAlign: 'center' }}>Your CTS Balance: {ctsBalance}</h2>
            
            {/* Clicker component */}
            <Clicker />
            
            {/* Guessing game component */}
            <GuessingGame />
        </div>
    );
};

export default DashboardPage;
