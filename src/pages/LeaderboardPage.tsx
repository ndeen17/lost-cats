import { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";

interface User {
  userName: string;
  score: number;
}
const Loader = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};
const LEADERBOARD_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

const LeaderboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserScore, setCurrentUserScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/leaderboard`
      );
      if (res.data && Array.isArray(res.data)) {
        setLoading(false);
        // Sort by score and get top 100
        const topUsers = res.data
          .sort((a: User, b: User) => b.score - a.score)
          .slice(0, 100);

        setLeaderboardData(topUsers);

        const userName = localStorage.getItem("username");
        const currentUser = res.data.find(
          (user: User) => user.userName === userName
        );

        if (currentUser) {
          setCurrentUserScore(currentUser.score);
          const userRank =
            res.data
              .sort((a: User, b: User) => b.score - a.score)
              .findIndex((user: User) => user.userName === userName) + 1;
          setCurrentUserRank(userRank);
        }

        // Cache the filtered data
        localStorage.setItem("leaderboardData", JSON.stringify(topUsers));
        localStorage.setItem("leaderboardTimestamp", Date.now().toString());
      } else {
        setLoading(false);
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching leaderboard:", error);
      setError("Unable to load leaderboard. Please try again later.");
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("leaderboardData");
    const cachedTimestamp = localStorage.getItem("leaderboardTimestamp");

    if (cachedData && cachedTimestamp) {
      const currentTime = Date.now();
      const expirationTime =
        parseInt(cachedTimestamp, 10) + LEADERBOARD_EXPIRATION_TIME;

      if (currentTime < expirationTime) {
        const parsedData = JSON.parse(cachedData);
        setLeaderboardData(parsedData);

        const userName = localStorage.getItem("username");
        const currentUser = parsedData.find(
          (user: User) => user.userName === userName
        );

        if (currentUser) {
          setCurrentUserScore(currentUser.score);
          setCurrentUserRank(parsedData.indexOf(currentUser) + 1);
        }
        return;
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div
      style={{
        padding: "10px",
        // backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
      className="leaderBoards"
    >
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Add any additional content you want to show when data is loaded */}
        </div>
      )}
      <h2 style={{ textAlign: "center", color: "white" }}>Leaderboard</h2>

      {error ? (
        <div
          style={{
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#d4edda",
              color: "#155724",
              border: "1px solid #c3e6cb",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {currentUserRank !== null
              ? `Congratulations! You are ranked #${currentUserRank} with ${currentUserScore} NDT`
              : "Loading..."}
          </div>

          <div
            style={{
              color: "black",
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "20px",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderSpacing: "0",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0)",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    User
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    NDT
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((user, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#fff",
                        borderBottom: "1px solid #dee2e6",
                      }}
                    >
                      <td style={{ padding: "10px", textAlign: "left" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "10px", textAlign: "left" }}>
                        {user.userName}
                      </td>
                      <td style={{ padding: "10px", textAlign: "left" }}>
                        {user.score}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: "center", padding: "10px" }}
                    >
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
