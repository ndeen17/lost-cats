// src/components/Clicker.tsx
import React from 'react';
import { useUser } from '../context/UserContext';

const Clicker = () => {
    const { updateCtsBalance } = useUser();

    const handleClick = () => {
        updateCtsBalance(1); // Increase CTS by 1 for each click
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <img
                src="https://via.placeholder.com/150" // Placeholder image URL
                alt="Clicker"
                onClick={handleClick}
                style={{
                    cursor: 'pointer',
                    borderRadius: '50%',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
                }}
            />
        </div>
    );
};

export default Clicker;
