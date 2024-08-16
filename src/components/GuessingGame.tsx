// src/components/GuessingGame.tsx
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const GuessingGame = () => {
    const { updateCtsBalance } = useUser();
    const [userGuess, setUserGuess] = useState('');
    const [message, setMessage] = useState('');
    const [attempted, setAttempted] = useState(false);

    const correctNumber = Math.floor(Math.random() * 20) + 1;

    const handleGuess = () => {
        if (attempted) {
            setMessage('You have already guessed today. Try again tomorrow!');
            return;
        }

        const guess = parseInt(userGuess, 10);
        if (guess === correctNumber) {
            const reward = Math.floor(Math.random() * 2501) + 500; // Reward between 500 and 3000 CTS
            updateCtsBalance(reward);
            setMessage(`Correct! You have earned ${reward} CTS.`);
        } else {
            setMessage('Incorrect guess. Try again tomorrow.');
        }

        setAttempted(true);
    };

    return (
        <div style={{
            marginTop: '20px',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#fff',
            textAlign: 'center',
            color: '#000'
        }}>
            <h3>Guess the Number (1-20)</h3>
            <input
                type="number"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Your guess"
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #000' }}
            />
            <button
                onClick={handleGuess}
                style={{
                    marginLeft: '10px',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Submit
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default GuessingGame;
