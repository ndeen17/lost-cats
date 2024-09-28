import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // Import user context to access userName
import axios from 'axios';

// Define the User interface to match the structure you expect from your backend
interface User {
    userName: string;
    ctsBalance: number; // Add any additional fields you want to display here
}

const WelcomePage = () => {
    const { userName } = useUser(); // Get userName from the context
    const [userData, setUserData] = useState<User | null>(null); // State to store user data
    const [error, setError] = useState<string | null>(null); // State to handle errors

    // Function to fetch user data from the backend
    const fetchUserData = async () => {
        try {
            // Log the API URL to ensure it's correctly set
            console.log('API URL:', import.meta.env.VITE_API_URL);

            // Fetch user data using userName
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userName}`);

            // Check if the response has data
            if (res.data) {
                setUserData(res.data); // Set user data in state
            } else {
                throw new Error("Invalid response format"); // Handle unexpected responses
            }
        } catch (error) {
            console.error("Error fetching user data:", error); // Log the error for debugging
            setError("Failed to load user data."); // Set error message
        }
    };

    // Use useEffect to fetch user data when the component mounts or userName changes
    useEffect(() => {
        fetchUserData(); // Call the function to fetch user data
    }, [userName]); // Dependency array: fetch when userName changes

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome!</h2>

            {/* Error Handling */}
            {error ? (
                <div style={{
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    textAlign: 'center',
                    fontWeight: 'bold',
                }}>
                    {error} {/* Display error message */}
                </div>
            ) : (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    {userData ? (
                        <h3>Welcome back, {userData.userName}! Your CTS Balance: {userData.ctsBalance}</h3>
                    ) : (
                        <p>Loading user data...</p> // Display loading message while data is being fetched
                    )}
                </div>
            )}
        </div>
    );
};

export default WelcomePage;
