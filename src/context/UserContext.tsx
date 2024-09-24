import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

// Create UserContext with default values
const UserContext = createContext<any>(null);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Context Provider to wrap the app
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userName, setUserName] = useState<string | null>(null);
    const [ctsBalance, setCtsBalance] = useState<number>(0);

    // Fetch user from the backend
    const fetchUser = async (name: string) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${name}`); // Fetch user details by username
            setUserName(res.data.userName);
            setCtsBalance(res.data.ctsBalance);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    // Update CTS balance in the backend
    const updateCtsBalance = async (amount: number) => {
        try {
            const newBalance = ctsBalance + amount;
            const res = await axios.patch(`${process.env.REACT_APP_API_URL}/users/${userName}`, { ctsBalance: newBalance }); // PATCH request
            setCtsBalance(res.data.ctsBalance);
        } catch (error) {
            console.error("Error updating CTS balance:", error);
        }
    };

    useEffect(() => {
        // Fetch user when the component mounts
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            fetchUser(storedUserName);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName, ctsBalance, updateCtsBalance }}>
            {children}
        </UserContext.Provider>
    );
};
