import { useEffect, useState } from "react";
import "../styles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

// Interfaces
interface TileFormat {
  day: number;
  reward: string;
}

interface CtsBalance {
  reward: number;
}

const Loader = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const [userRewarded, setUserRewarded] = useState<string>("");
  const [daysPassed, setDaysPassed] = useState<number>(0);
  const navigate = useNavigate(); // Initialize navigate

  const handleTile = (tile: TileFormat) => {
    setCurrentTile(tile);
  };

  // Function to start the tile display with a delay
  const startTile = () => {
    setTimeout(() => {
      setTileDisplay(true);
    }, 2500);
  };

  const fetchUserData = async () => {
    const storedUsername = localStorage.getItem("username");
    const storedCtsBalance = localStorage.getItem("ctsBalance");

    // If both username and balance exist in local storage, use them
    if (storedUsername && storedCtsBalance) {
      // setUsername(storedUsername);
      // setCtsBalance(parseFloat(storedCtsBalance));
    } else if (storedUsername) {
      // Otherwise, fetch from the backend
      try {
        const checkRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/check/${storedUsername}`
        );

        // Redirect if the user doesn't exist
        if (!checkRes.data.exists) {
          navigate("/"); // Redirect to the welcome page
          return;
        }

        // Fetch user data
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${storedUsername}`
        );
        // setUsername(res.data.userName);
        // setCtsBalance(res.data.ctsBalance);

        // Store the data in local storage for future use
        localStorage.setItem("username", res.data.userName);
        localStorage.setItem("ctsBalance", res.data.ctsBalance.toString());
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
      }
    } else {
      // alert("login again");
      toast.error("Login again", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setError("No username found in local storage.");
    }
  };

  useEffect(() => {
    // Check local storage and fetch data only if necessary
    fetchUserData();

    // Set an interval to refetch user data every 60 seconds
    const intervalId = setInterval(() => {
      fetchUserData();
    }, 60000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const COOKIE_NAME = "timestampCookie";
    const COOKIE_TODAY = "cookieToday";
    const COOKIE_DAY = "cookieDay";

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
    const storedDay = getStoredTimestamp(COOKIE_DAY);
    const currentTimestamp = Date.now();

    // Function to handle the initial reward setup and cookie setting
    const handleInitialRewardSetup = () => {
      startTile();
      handleTile(rewards[0]);

      const newTimestamp = currentTimestamp.toString();
      setCookieWithExpiry(COOKIE_NAME, newTimestamp, 7); // 7 days expiry
      setCookieWithExpiry(COOKIE_TODAY, newTimestamp, 1); // 1 day expiry
      setCookieWithExpiry(COOKIE_DAY, "1", 7); // 7 days expiry
      setDaysPassed(0); // It's the first day
    };

    if (!storedTimestamp && !storedTimestampToday && !storedDay) {
      // No cookies found, start new reward process
      handleInitialRewardSetup();
    } else if (storedTimestamp && storedTimestampToday && storedDay) {
      // Both cookies exist, calculate the difference for the reward
      const storedDayValue = storedDay ? parseInt(storedDay.toString(), 10) : 0;
      const diffInMilliseconds = currentTimestamp - storedTimestamp;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days

      if (storedDayValue !== diffInDays + 1) {
        // Day mismatch, start new reward process
        handleInitialRewardSetup();
      } else {
        // Continue with the reward flow
        setDaysPassed(diffInDays + 1);
        handleTile(rewards[diffInDays]);
        setCookieWithExpiry(COOKIE_DAY, `${diffInDays + 1}`, 7); // Update the "day" cookie
      }
    } else if (storedTimestamp && !storedTimestampToday && storedDay) {
      // Inconsistent state, need to check for correct day transition
      // setCookieWithExpiry(COOKIE_TODAY, currentTimestamp.toString(), 1);
      const storedDayValue = storedDay ? parseInt(storedDay.toString(), 10) : 0;
      const diffInMilliseconds = currentTimestamp - storedTimestamp;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days

      if (storedDayValue !== diffInDays + 1) {
        // Day mismatch, start new reward process
        handleInitialRewardSetup();
      } else {
        // Continue with the reward flow
        startTile();
        setDaysPassed(diffInDays + 1);
        handleTile(rewards[diffInDays]);
        setCookieWithExpiry(COOKIE_DAY, `${diffInDays + 1}`, 7); // Update the "day" cookie
      }
    } else {
      console.error("Invalid state. Cookie timestamps are inconsistent.");
    }
  }, []);

  const handleCompleteTask = async (ctsBalanceVal: CtsBalance) => {
    setButDisplay(false);
    setLoading(true);
    setTileDisplay(false);

    const COOKIE_NAME = "timestampCookie";
    const COOKIE_TODAY = "cookieToday";
    const COOKIE_DAY = "cookieDay";

    // Helper function to get stored timestamp from cookies
    const getStoredTimestamp = (cookieName: string): number | null => {
      const cookieValue = getCookie(cookieName);
      return cookieValue ? parseInt(cookieValue.slice(1), 10) : null;
    };

    // Helper function to set cookie with expiry
    const setCookieWithExpiry = (
      cookieName: string,
      value: string,
      days: number
    ): void => {
      setCookie(cookieName, value, days);
    };

    try {
      // Get stored timestamp and calculate the difference in days
      const storedTimestamp = getStoredTimestamp(COOKIE_NAME);
      if (!storedTimestamp) {
        console.error("Timestamp cookie is missing.");
        // alert("Timestamp cookie is missing. Please try again.");
        return;
      }

      const currentTimestamp = Date.now();
      const diffInMilliseconds = currentTimestamp - storedTimestamp;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days

      // Get the username from localStorage
      const userName = localStorage.getItem("username");
      if (!userName) {
        // alert("User not found. Please sign in again.");
        return;
      }
      // Get the current balance from localStorage and calculate the new balance
      const currentBalance = parseInt(
        localStorage.getItem("ctsBalance") || "0",
        10
      );
      const newBalance = currentBalance + ctsBalanceVal.reward;

      // Send the updated balance to the server
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${userName}`,
        { ctsBalance: newBalance, taskType: "DailyReward", day: diffInDays + 1 }
      );

      if (res.data) {
        setLoading(false);
        console.log(res.data);
        // Update cookies for today and the day count
        setCookieWithExpiry(COOKIE_TODAY, currentTimestamp.toString(), 1); // 1 day expiry
        setCookieWithExpiry(COOKIE_DAY, `${diffInDays + 1}`, 7); // 7 days expiry
        // Update the balance in localStorage and update UI state
        localStorage.setItem("ctsBalance", newBalance.toString());
        setTileDisplay(false);
        toast.success("Claimed!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        // setUserRewarded("true"); // Optional: Mark the user as rewarded
      } else {
        setLoading(false);
        console.log(res.data);
        setTileDisplay(false);
        toast.error("An error occured", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occured", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error("Error completing task:", error);
      // alert("Something went wrong. Please try again.");
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
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Add any additional content you want to show when data is loaded */}
        </div>
      )}
      <div className="header">
        <h5>Daily Checking</h5>
        <span></span>
      </div>

      <div className={`wrapper ${tileDisplay ? "fadeIn" : "fadeOut"}`}>
        <div className="tile">
          <h4>Day {currentTile?.day}</h4>
          <span>♦</span>
          <h4 className="coin">
            <b className="plus">+</b>
            {currentTile?.reward}
            <span className="NDT">$NDT</span>
          </h4>
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
        <p>Gain free $NDT with daily login streak</p>

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
        {error && <div style={{ color: "red", fontSize: "3vw" }}>{error}</div>}
        {/* } */}
      </div>
    </div>
  );
}
