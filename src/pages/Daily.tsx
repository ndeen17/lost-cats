import { useState } from 'react';
import axios from 'axios';


const Daily = () => {
    const [, setReward] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);


    const claimReward = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/daily-reward`, {
                userName: localStorage.getItem('username')
            });
            setReward(res.data.reward);
        } catch (error) {
            console.error("Error claiming daily reward:", error);
            setError("Coming soon. Please try again later.");
        }
    };

   
  return (
    <div
      style={{
        padding: "20px",
        background: "radial-gradient(circle, rgba(0, 0, 0, 0.7) 50%, #7d0000 100%)",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Calendar Icon */}
      <div
        style={{
          fontSize: "6vw",
          color: "#aaf0ff",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontSize: "10vw", display: "block" }}>📅</span>
      </div>

      {/* Title */}
      <h1 style={{ fontSize: "6vw", margin: "20px 0", lineHeight: "1.2", color: "#aaf0ff" }}>
        Daily Reward
      </h1>

      {/* Subtitle */}
      <p style={{ fontSize: "4vw", margin: "10px 0 20px", color: "#aaf0ff" }}>
        Gain more NDT with daily login streak
      </p>

      {/* Reward Button */}
      <button
        onClick={claimReward}
        style={{
          color: "#aaf0ff",
          backgroundColor: "#440000",
          padding: "10px 30px",
          borderRadius: "50px",
          fontSize: "4vw",
          cursor: "pointer",
          border: "2px solid #aaf0ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          transition: "transform 0.3s, background-color 0.3s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#aaf0ff";
          e.currentTarget.style.color = "#440000";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#440000";
          e.currentTarget.style.color = "#aaf0ff";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Claim +1000NDT
        <span
          style={{
            display: "inline-block",
            width: "15px",
            height: "15px",
            backgroundColor: "#aaf0ff",
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      </button>

      {/* Error Message */}
      {error && <div style={{ color: "red", fontSize: "3vw", marginTop: "20px" }}>{error}</div>}

    </div>
  );
};

export default Daily;