// src/pages/LeaderboardPage.tsx
import { useUser } from '../context/UserContext';

const LeaderboardPage = () => {
    const { userName } = useUser();

    // Retrieve leaderboard data from localStorage
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard') || '[]');

    // Add the current user to the leaderboard data if not already present
    const updatedLeaderboardData = leaderboardData.some((user: any) => user.userName === userName)
        ? leaderboardData
        : [...leaderboardData, { userName, score: 0 }]; // Default score if not found

    // Sort leaderboard data by score (highest to lowest)
    const sortedLeaderboard = updatedLeaderboardData.sort((a: any, b: any) => b.score - a.score);

    // Find the current user's rank and score
    const currentUserRank = sortedLeaderboard.findIndex(user => user.userName === userName) + 1;
    const currentUserScore = sortedLeaderboard.find(user => user.userName === userName)?.score || 0;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Leaderboard</h2>

            {/* Message displaying current user's rank and score */}
            <div style={{
                marginBottom: '20px',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
                textAlign: 'center',
            }}>
                Meow! You are ranked #{currentUserRank} with {currentUserScore} CTS
            </div>

            {/* Table displaying the leaderboard */}
            <div style={{
                color: 'black',
                borderCollapse: 'collapse',
                width: '100%',
                marginTop: '20px',
            }}>
                <table style={{
                    width: '100%',
                    borderSpacing: '0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Rank</th>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>User</th>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>CTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedLeaderboard.map((user: any, index: number) => (
                            <tr key={index} style={{
                                backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                                borderBottom: '1px solid #ddd',
                            }}>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{index + 1}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{user.userName}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{user.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardPage;
