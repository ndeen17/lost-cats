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

    // Log API URL to ensure it's set correctly
    useEffect(() => {
        console.log('API URL:', import.meta.env.VITE_API_URL);
    }, []);

    // Fetch user data from the backend
    const fetchUser = async (name: string) => {
        try {
            console.log(`Fetching data for user: ${name}`);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${name}`);
            setUserName(res.data.userName);
            setCtsBalance(res.data.ctsBalance);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.log("User not found, creating new user.");
                await createUser(name); // Create user if not found
            } else {
                console.error("Error fetching user:", error);
            }
        }
    };

    // Create a new user in the backend
    const createUser = async (name: string) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, { userName: name });
            setUserName(res.data.userName);
            setCtsBalance(res.data.ctsBalance);
            console.log(`User ${name} created successfully.`);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // Update CTS balance in the backend
    const updateCtsBalance = async (amount: number) => {
        if (!userName) {
            console.error("Cannot update balance: userName is null");
            return;
        }

        try {
            const newBalance = ctsBalance + amount;
            console.log(`Updating CTS balance for ${userName} to ${newBalance}`);
            const res = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${userName}`, { ctsBalance: newBalance });
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
        } else {
            // If no user found, treat them as a guest and create a guest user
            const guestUserName = 'Guest_' + Math.floor(Math.random() * 1000); // Generate a random guest username
            console.log("No user found, creating guest user:", guestUserName);
            createUser(guestUserName);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName, ctsBalance, updateCtsBalance }}>
            {children}
        </UserContext.Provider>
    );
};
