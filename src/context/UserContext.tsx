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

            // Save user data in local storage for persistence
            localStorage.setItem('userName', res.data.userName);
            localStorage.setItem('ctsBalance', res.data.ctsBalance.toString());
            localStorage.setItem('chatId', chatId);
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

            // Store user data in local storage
            localStorage.setItem('userName', res.data.userName);
            localStorage.setItem('ctsBalance', res.data.ctsBalance.toString());
            localStorage.setItem('chatId', chatId);
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

            // Update local storage
            localStorage.setItem('ctsBalance', res.data.ctsBalance.toString());
        } catch (error) {
            console.error("Error updating CTS balance:", error);
        }
    };

    useEffect(() => {
        // Fetch user when the component mounts
        const storedChatId = localStorage.getItem('chatId');
        if (storedChatId) {
            setChatId(storedChatId);
            fetchUser(storedChatId);
        } else {
            // Retrieve chatId from Telegram Web App
            const initData = window.Telegram.WebApp.initData; // Telegram Web App data
            const chatIdFromTelegram = new URLSearchParams(initData).get('chat_id');

            if (chatIdFromTelegram) {
                console.log("Telegram chat ID found:", chatIdFromTelegram);
                setChatId(chatIdFromTelegram);

                // Store chatId in local storage
                localStorage.setItem('chatId', chatIdFromTelegram);

                fetchUser(chatIdFromTelegram); // Fetch user data based on chatId
            } else {
                console.log("No chat ID found in Telegram Web App.");
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName, ctsBalance, updateCtsBalance }}>
            {children}
        </UserContext.Provider>
    );
};
