import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the User type
interface User {
    userName: string;
    score: number;
}

const LeaderboardPage = () => {
    const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [currentUserScore, setCurrentUserScore] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // Fetch leaderboard data from the backend
    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/leaderboard`);

            if (res.data && Array.isArray(res.data)) {
                // Store leaderboard data in localStorage
                localStorage.setItem('leaderboardData', JSON.stringify(res.data));

                // Process leaderboard data
                setLeaderboardData(res.data);
                
                // Get username from localStorage
                const userName = localStorage.getItem('username');
                const currentUser = res.data.find((user: User) => user.userName === userName);
                
                if (currentUser) {
                    setCurrentUserScore(currentUser.score);
                    setCurrentUserRank(res.data.indexOf(currentUser) + 1);
                    
                    // Store rank and score in localStorage
                    localStorage.setItem('currentUserRank', (res.data.indexOf(currentUser) + 1).toString());
                    localStorage.setItem('currentUserScore', currentUser.score.toString());
                }
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            setError("Failed to load leaderboard data.");
        }
    };

    useEffect(() => {
        const storedLeaderboardData = localStorage.getItem('leaderboardData');
        const storedUserRank = localStorage.getItem('currentUserRank');
        const storedUserScore = localStorage.getItem('currentUserScore');

        if (storedLeaderboardData && storedUserRank && storedUserScore) {
            // Use cached data from localStorage
            setLeaderboardData(JSON.parse(storedLeaderboardData));
            setCurrentUserRank(parseInt(storedUserRank));
            setCurrentUserScore(parseFloat(storedUserScore));
        } else {
            // Fetch data only if not available in localStorage
            fetchLeaderboard();
        }
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Leaderboard</h2>

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
                    {error}
                </div>
            ) : (
                <>
                    {/* Message displaying current user's rank and score */}
                    <div style={{
                        marginBottom: '20px',
                        padding: '15px',
                        borderRadius: '8px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb',
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}>
                        {currentUserRank !== null
                            ? `Meow! You are ranked #${currentUserRank} with ${currentUserScore} CTS`
                            : 'Loading...'}
                    </div>

                    {/* Table displaying the leaderboard */}
                    <div style={{
                        color: 'black',
                        borderCollapse: 'collapse',
                        width: '100%',
                        marginTop: '20px',
                        overflowX: 'auto',
                    }}>
                        <table style={{
                            width: '100%',
                            borderSpacing: '0',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff',
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Rank</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>User</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>CTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.length > 0 ? (
                                    leaderboardData.map((user, index) => (
                                        <tr key={index} style={{
                                            backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff',
                                            borderBottom: '1px solid #dee2e6',
                                        }}>
                                            <td style={{ padding: '10px', textAlign: 'left' }}>{index + 1}</td>
                                            <td style={{ padding: '10px', textAlign: 'left' }}>{user.userName}</td>
                                            <td style={{ padding: '10px', textAlign: 'left' }}>{user.score}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', padding: '10px' }}>
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default LeaderboardPage;
