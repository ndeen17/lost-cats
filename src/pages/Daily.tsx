import { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles.css"


const Daily = () => {
    const [reward, setReward] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
  const [daysPassed, setDaysPassed] = useState<number>(0);

     useEffect(() => {
        const cookieName = "timestampCookie";
        // Check if the cookie exists
        let cookieValue = getCookie(cookieName);
    
        console.log(cookieValue)
    
        if (!cookieValue) {
          // If no cookie, create a new cookie with the current timestamp
          const currentTimestamp = Date.now(); // milliseconds
          setCookie(cookieName, currentTimestamp.toString(), 7); // Expires in 7 days
          setDaysPassed(1); // It's day 1 when the cookie is first set
        } else {
          // Cookie exists, calculate the difference in days
          const storedTimestamp = parseInt(cookieValue.slice(1, cookieValue.length), 10);
          // console.log(storedTimestamp)
          if (isNaN(storedTimestamp)) {
            console.error("Invalid timestamp in cookie.");
            return;
          }
          const currentTimestamp = Date.now();
          console.log(currentTimestamp)
          // const currentTimestamp =1734966862568   //3 days timeline
    
          const diffInMilliseconds = currentTimestamp - storedTimestamp;
          const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
          setDaysPassed(diffInDays + 1);
    
          console.log(diffInDays + 1)
          // Update the cookie with the new day count
          // setCookie(cookieName, storedTimestamp.toString(), 7); // The timestamp remains the same, only the day count changes
        }
      }, []);


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

const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};


const getCookie = (name: string) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
};
