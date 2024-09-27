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
    const [chatId, setChatId] = useState<string | null>(null); // Store Telegram chatId

    // Log API URL to ensure it's set correctly
    useEffect(() => {
        console.log('API URL:', import.meta.env.VITE_API_URL);
    }, []);

    // Fetch user data from the backend
    const fetchUser = async (chatId: string) => {
        try {
            console.log(`Fetching data for chat ID: ${chatId}`);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${chatId}`);
            setUserName(res.data.userName);
            setCtsBalance(res.data.ctsBalance);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.log("User not found, creating new user.");
                await createUser(chatId); // Create user if not found
            } else {
                console.error("Error fetching user:", error);
            }
        }
    };

    // Create a new user in the backend
    const createUser = async (chatId: string) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, { chatId });
            setUserName(res.data.userName);
            setCtsBalance(res.data.ctsBalance);
            setChatId(chatId); // Store chat ID when creating a new user
            console.log(`User with Chat ID ${chatId} created successfully.`);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // Update CTS balance in the backend
    const updateCtsBalance = async (amount: number) => {
        if (!chatId) {
            console.error("Cannot update balance: chatId is null");
            return;
        }

        try {
            const newBalance = ctsBalance + amount;
            console.log(`Updating CTS balance for Chat ID ${chatId} to ${newBalance}`);
            const res = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${chatId}`, { ctsBalance: newBalance });
            setCtsBalance(res.data.ctsBalance);
        } catch (error) {
            console.error("Error updating CTS balance:", error);
        }
    };

    useEffect(() => {
        // Fetch user when the component mounts
        if (chatId) {
            fetchUser(chatId); // Call fetchUser when chatId is available
        } else {
            console.log("Chat ID not set.");
        }
    }, [chatId]);

    return (
        <UserContext.Provider value={{ userName, ctsBalance, updateCtsBalance, setChatId }}>
            {children}
        </UserContext.Provider>
    );
};
