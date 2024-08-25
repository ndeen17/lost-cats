// src/context/UserContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

// Create UserContext with default values
const UserContext = createContext<any>(null);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Context Provider to wrap the app
export const UserProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state with localStorage values or default values
    const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName') || null);
    const [ctsBalance, setCtsBalance] = useState<number>(() => Number(localStorage.getItem('ctsBalance')) || 0);

    // Persisting CTS balance using local storage
    const updateCtsBalance = (amount: number) => {
        const newBalance = ctsBalance + amount;
        setCtsBalance(newBalance);
        localStorage.setItem('ctsBalance', newBalance.toString());

        // Update leaderboard in local storage
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        const existingUserIndex = leaderboard.findIndex((user: any) => user.userName === userName);
        if (existingUserIndex >= 0) {
            leaderboard[existingUserIndex].score = newBalance;
        } else {
            leaderboard.push({ userName, score: newBalance });
        }
        leaderboard.sort((a: any, b: any) => b.score - a.score); // Sort by score descending
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    };

    // Provide context values to children components
    return (
        <UserContext.Provider value={{ userName, setUserName, ctsBalance, updateCtsBalance }}>
            {children}
        </UserContext.Provider>
    );
};
