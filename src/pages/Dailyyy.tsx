import { useEffect, useState } from "react";
import "../styles.css";
import axios from "axios";

// Interfaces
interface TileFormat {
  day: number;
  reward: string;
}

interface CtsBalance {
  reward: number;
}

const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name: string) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
};

export default function Dailyyy() {
  const [currentTile, setCurrentTile] = useState<TileFormat | null>(null);
  const [tileDisplay, setTileDisplay] = useState(false);
  const [butDisplay, setButDisplay] = useState(true);
  // const [userRewarded, setUserRewarded] = useState<string>("");
  const [daysPassed, setDaysPassed] = useState<number>(0);

  const handleTile = (tile: TileFormat) => {
    setCurrentTile(tile);
  };

  // Function to start the tile display with a delay
  const startTile = () => {
    setTimeout(() => {
      setTileDisplay(true);
    }, 2500);
  };

  // useEffect(()=>{
  //   setUserRewarded(false)
  // },[])

  // useEffect(() => {
  //   // Set the tile data
  //   handleTile(rewards[daysPassed]);
  //   startTile();
  // }, []);

  useEffect(() => {
    const COOKIE_NAME = "timestampCookie";
    const COOKIE_TODAY = "cookieToday";

    // Helper functions
    const getStoredTimestamp = (cookieName: string): number | null => {
      const cookieValue = getCookie(cookieName);
      return cookieValue ? parseInt(cookieValue.slice(1), 10) : null;
    };

    const setCookieWithExpiry = (
      cookieName: string,
      value: string,
      days: number
    ): void => {
      setCookie(cookieName, value, days);
    };

    // Main logic
    const storedTimestamp = getStoredTimestamp(COOKIE_NAME);
    const storedTimestampToday = getStoredTimestamp(COOKIE_TODAY);
    const currentTimestamp = Date.now();

    if (!storedTimestamp && !storedTimestampToday) {
      // No cookies found, start new reward process
      // setUserRewarded("false");
      startTile();
      handleTile(rewards[0]);

      const newTimestamp = currentTimestamp.toString();
      setCookieWithExpiry(COOKIE_NAME, newTimestamp, 7); // 7 days expiry
      setCookieWithExpiry(COOKIE_TODAY, newTimestamp, 1); // 1 day expiry
      setDaysPassed(0); // It's the first day
    } else if (storedTimestamp && !storedTimestampToday) {
      // Cookie exists but no 'today' cookie
      // setUserRewarded("false");
      startTile();

      const diffInMilliseconds = currentTimestamp - storedTimestamp;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days

      setDaysPassed(diffInDays + 1);
      handleTile(rewards[diffInDays]);
      console.log(diffInDays + 1);

      console.log(rewards[diffInDays]);

      // setCookieWithExpiry(COOKIE_TODAY, currentTimestamp.toString(), 1);
    } else if (storedTimestamp && storedTimestampToday) {
      // Both cookies exist, calculate the difference for the reward
      const diffInMilliseconds = currentTimestamp - storedTimestamp;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days

      setDaysPassed(diffInDays + 1);
      handleTile(rewards[diffInDays]);

      // console.log(diffInDays + 1)
      // console.log(rewards[diffInDays])
    } else {
      console.error("Invalid state. Cookie timestamps are inconsistent.");
    }
  }, []);

  const handleCompleteTask = async (ctsBalanceVal: CtsBalance) => {
    setButDisplay(false);
    setTileDisplay(false);
    try {
      // Get the userName from localStorage
      const userName = localStorage.getItem("username");
      if (!userName) {
        alert("User not found. Please sign in again.");
        return;
      }
      const COOKIE_TODAY = "cookieToday";

      const setCookieWithExpiry = (
        cookieName: string,
        value: string,
        days: number
      ): void => {
        setCookie(cookieName, value, days);
      };

      const currentTimestamp = Date.now();
      setCookieWithExpiry(COOKIE_TODAY, currentTimestamp.toString(), 1);

      // Get the current balance from localStorage and calculate the new balance
      const currentBalance = parseInt(
        localStorage.getItem("ctsBalance") || "0",
        10
      );
      const newBalance = currentBalance + ctsBalanceVal.reward;

      // Send the updated balance to the server
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${userName}`,
        { ctsBalance: newBalance, taskType: "DailyReward", day: daysPassed }
      );
      console.log(res.data);
      // Update the balance in localStorage
      localStorage.setItem("ctsBalance", newBalance.toString());
      setTileDisplay(false);
      // setUserRewarded("true"); // Mark the user as rewarded
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Reward data
  const rewards: TileFormat[] = [
    { day: 1, reward: "500" },
    { day: 2, reward: "1K" },
    { day: 3, reward: "2K" },
    { day: 4, reward: "4K" },
    { day: 5, reward: "10K" },
    { day: 6, reward: "30K" },
    { day: 7, reward: "50K" },
  ];
  const rewards2: CtsBalance[] = [
    { reward: 500 },
    { reward: 1000 },
    { reward: 2000 },
    { reward: 4000 },
    { reward: 10000 },
    { reward: 30000 },
    { reward: 50000 },
  ];

  return (
    <div className="dailyRewardsCont">
      <div className="header">
        <h5>Daily Checking</h5>
        <span></span>
      </div>

      <div className={`wrapper ${tileDisplay ? "fadeIn" : "fadeOut"}`}>
        <div className="tile">
          <h4>Day {currentTile?.day}</h4>
          <span>♦</span>
          <h4 className="coin">{currentTile?.reward}</h4>
        </div>
        <button
          onClick={() => {
            handleCompleteTask(rewards2[daysPassed - 1]);
          }}
          style={butDisplay ? { display: "flex" } : { display: "none" }}
        >
          Claim
        </button>
      </div>

      <div className="inner">
        <span style={{ fontSize: "10vw", display: "block" }}>📅</span>
        <h3>Hey there</h3>
        <p>Gain your diamonds with daily login streak</p>

        {/* {userRewarded === "true" || ""?<div className="rewards">
          {rewards.map((item, index) => (
            <div
              key={index}
              className="item"
              style={(daysPassed - (index+1)) !< 0? {}:{background:"transparent"}}
            >
              <h4>Day {item.day}</h4>
              <span>♦</span>
              <h4 className="coin">{item.reward}</h4>
            </div>
          ))}
        </div>:  */}
        <div className="rewards">
          {rewards.map((item, index) => (
            <div
              key={index}
              className={`item ${
                currentTile?.day === item.day ? "center-rotate-scale" : ""
              } ${index === 6 ? "day7" : ""} ${
                item.day <= (currentTile?.day || 0)
                  ? "transparentBackground"
                  : ""
              }`}
            >
              <h4>Day {item.day}</h4>
              <span>♦</span>
              <h4 className="coin">{item.reward}</h4>
            </div>
          ))}
        </div>
        {/* } */}
      </div>
    </div>
  );
}
