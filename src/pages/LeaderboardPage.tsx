import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';

// Define the User type
interface User {
    userName: string;
    score: number;
}

const LeaderboardPage = () => {
    const { userName } = useUser();
    const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [currentUserScore, setCurrentUserScore] = useState<number>(0);
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch leaderboard data from the backend
    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/leaderboard`);
            setLeaderboardData(res.data);
            const currentUser = res.data.find((user: User) => user.userName === userName);
            if (currentUser) {
                setCurrentUserScore(currentUser.score);
                setCurrentUserRank(res.data.indexOf(currentUser) + 1);
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false); // Stop loading once the request is complete
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Leaderboard</h2>

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

            {/* Loading and empty state handling */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
                    Loading leaderboard...
                </p>
            ) : leaderboardData.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
                    No users on the leaderboard yet!
                </p>
            ) : (
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
                            {leaderboardData.map((user, index) => (
                                <tr key={index} style={{
                                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff',
                                    borderBottom: '1px solid #dee2e6',
                                }}>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{index + 1}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{user.userName}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{user.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;
