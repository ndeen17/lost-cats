import { useEffect, useState } from "react";
import "../styles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CountdownTimer from "../components/CountdownTimer";
// import RewardSystem from "../components/RewardSystem";

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
  // const [rotate, setRotate] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const [userRewarded, setUserRewarded] = useState<string>("");
  // const [daysPassed, setDaysPassed] = useState<number>(0);
  const navigate = useNavigate(); // Initialize navigate
  // const [initialTime, setInitialTime] = useState<number>(86400); // 24 hours in seconds
  // const [lastTaskCompletedTime, setLastTaskCompletedTime] = useState<number>(0); // Example timestamp
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
  };

  //rotates
  const handleTile = (tile: TileFormat) => {
    setCurrentTile(tile);
  };

  // shows tile
  const startTile = () => {
    setTimeout(() => {
      setTileDisplay(true);
    }, 2500);
  };

  const fetchUserData = async () => {
    const storedUsername = localStorage.getItem("username");
    const storedCtsBalance = localStorage.getItem("ctsBalance");
    // localStorage.setItem("InitialTime", ""); // Save the remaining time to localStorage

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
        localStorage.setItem("username", "");
        localStorage.setItem("ctsBalance", "");
      }
    } else {
      toast.error("User not found. Login again", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setTimeout(() => {
        navigate("/");
      }, 500);
      setError("No username found in local storage.");
      localStorage.setItem("username", "");
      localStorage.setItem("ctsBalance", "");
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      fetchTasks(username); // Safe to call since we checked if `username` is not null
      const currentTime = Date.now();
      const lastTaskCompletedTime2 = Number(
        localStorage.getItem("lastTaskCompletedTime")
      );
      const timeElapsed = currentTime - lastTaskCompletedTime2;

      console.log(timeElapsed, lastTaskCompletedTime2);
      // If the task was completed recently (within the last 24 hours), adjust the timer to reflect the time left
      if (timeElapsed < 86400000) {
        // 86400000 ms = 24 hours
        const remainingTime = 86400 - Math.floor(timeElapsed / 1000); // Subtract elapsed time from 24 hours
        localStorage.setItem("InitialTime", remainingTime.toString()); // Save the remaining time to localStorage
      }
    } else {
      setError("No username found in localStorage");
    }
    // Check local storage and fetch data only if necessary
    fetchUserData();

    // Set an interval to refetch user data every 60 seconds
    const intervalId = setInterval(() => {
      fetchUserData();
    }, 60000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const COOKIE_NAME = "timestampCookie";
  //   const COOKIE_TODAY = "cookieToday";
  //   const COOKIE_DAY = "cookieDay";

  //   // Helper functions
  //   const getStoredTimestamp = (cookieName: string): number | null => {
  //     const cookieValue = getCookie(cookieName);
  //     return cookieValue ? parseInt(cookieValue.slice(1), 10) : null;
  //   };

  //   const setCookieWithExpiry = (
  //     cookieName: string,
  //     value: string,
  //     days: number
  //   ): void => {
  //     setCookie(cookieName, value, days);
  //   };

  //   // Main logic
  //   const storedTimestamp = getStoredTimestamp(COOKIE_NAME);
  //   const storedTimestampToday = getStoredTimestamp(COOKIE_TODAY);
  //   const storedDay = getStoredTimestamp(COOKIE_DAY);
  //   const currentTimestamp = Date.now();

  //   // Function to handle the initial reward setup and cookie setting
  //   const handleInitialRewardSetup = () => {
  //     // setRotate(true);
  //     startTile();
  //     handleTile(rewards[0]);

  //     const newTimestamp = currentTimestamp.toString();
  //     setCookieWithExpiry(COOKIE_NAME, newTimestamp, 7); // 7 days expiry
  //     // setCookieWithExpiry(COOKIE_TODAY, newTimestamp, 1); // 1 day expiry
  //     setCookieWithExpiry(COOKIE_DAY, "1", 7); // 7 days expiry
  //     // setDaysPassed(0); // It's the first day
  //     setCookieWithExpiry("daysPassed", "1", 7);
  //   };

  //   if (!storedTimestamp && !storedTimestampToday && !storedDay) {
  //     // No cookies found, start new reward process
  //     handleInitialRewardSetup();
  //   } else if (storedTimestamp && storedTimestampToday && storedDay) {
  //     // setRotate(false);
  //     // Both cookies exist, calculate the difference for the reward
  //     const storedDayValue = storedDay ? parseInt(storedDay.toString(), 10) : 0;
  //     const diffInMilliseconds = currentTimestamp - storedTimestamp;
  //     const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
  //     console.log(diffInDays);
  //     if (storedDayValue !== diffInDays + 1) {
  //       // Day mismatch, start new reward process
  //       handleInitialRewardSetup();
  //       setCookieWithExpiry(COOKIE_TODAY, "", -1);
  //     } else {
  //       // Continue with the reward flow
  //       // setDaysPassed(diffInDays + 1);
  //       setCookieWithExpiry("daysPassed", `${diffInDays + 1}`, 7);

  //       handleTile(rewards[diffInDays]);
  //       setCookieWithExpiry(COOKIE_DAY, `${diffInDays + 1}`, 7); // Update the "day" cookie
  //     }
  //   } else if (storedTimestamp && !storedTimestampToday && storedDay) {
  //     // setRotate(false);
  //     // Inconsistent state, need to check for correct day transition
  //     // setCookieWithExpiry(COOKIE_TODAY, currentTimestamp.toString(), 1);
  //     const storedDayValue = storedDay ? parseInt(storedDay.toString(), 10) : 0;
  //     const diffInMilliseconds = currentTimestamp - storedTimestamp;
  //     const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
  //     console.log(diffInDays);
  //     console.log(currentTimestamp);
  //     if (storedDayValue !== diffInDays + 1) {
  //       // Day mismatch, start new reward process
  //       handleInitialRewardSetup();
  //     } else {
  //       // Continue with the reward flow
  //       startTile();
  //       // setDaysPassed(diffInDays + 1);
  //       setCookieWithExpiry("daysPassed", `${diffInDays + 1}`, 7);

  //       handleTile(rewards[diffInDays]);
  //       setCookieWithExpiry(COOKIE_DAY, `${diffInDays + 1}`, 7); // Update the "day" cookie
  //     }
  //   } else {
  //     // setRotate(false);
  //     console.error("Invalid state. Cookie timestamps are inconsistent.");
  //   }
  // }, []);

  const setCookieWithExpiry = (
    cookieName: string,
    value: string,
    days: number
  ): void => {
    setCookie(cookieName, value, days);
  };

  const fetchTasks = async (userName: String) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/dailyTasks/${userName}`
      );

      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();
      console.log(data);

      const day = data.daysCompleted;
      console.log(day);

      // Save the number of days completed in a cookie with an expiry of 7 days
      setCookieWithExpiry("daysPassed", day, 7);

      // Ensure that the lastTaskCompletedTime is a valid number before saving
      const lastTaskTime = Number(data.lastTaskCompletedTime);
      if (!isNaN(lastTaskTime)) {
        localStorage.setItem("lastTaskCompletedTime", lastTaskTime.toString()); // Store it as a string in localStorage
        // setLastTaskCompletedTime(lastTaskTime); // Update state with the correct number
      } else {
        console.warn(
          "Invalid lastTaskCompletedTime",
          data.lastTaskCompletedTime
        );
      }

      // Handle reward and start the timer based on task completion
      if (!data.isActive) {
        startTile();
        handleTile(rewards[day]);
      } else {
        handleTile(rewards[day]);
        handleStartTimer();
      }

      // Store the task data in localStorage for later use
      localStorage.setItem("dailyTask", JSON.stringify(data)); // Store data as stringified JSON
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  const updateStreak = async (userName: string, reward: string) => {
    const storedCtsBalance = localStorage.getItem("ctsBalance");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/dailyTasks/${userName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Ensure proper content type
          },
          body: JSON.stringify({ rewardClaimed: reward }), // Send rewardClaimed as a string
        }
      );

      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();
      console.log(data);

      if (data) {
        setLoading(false);
        setTileDisplay(false);
        const newBalance =
          (parseFloat(storedCtsBalance || "0") || 0) + parseFloat(reward);

        const res = await axios.patch(
          `${import.meta.env.VITE_API_URL}/users/${userName}`,
          {
            ctsBalance: newBalance,
            taskType: "DailyReward",
            day: data.daysCompleted + 1,
          }
        );

        console.log(res);
        toast.success("Claimed!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        handleStartTimer();
        // Optional: Mark the user as rewarded
      } else {
        handleError("An error occurred");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Helper function for error handling
  const handleError = (message: string) => {
    setLoading(false);
    setTileDisplay(false);
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
    console.error("Error completing task:", message);
  };

  const handleCompleteTask = async (ctsBalanceVal: CtsBalance) => {
    setButDisplay(false);
    setLoading(true);
    setTileDisplay(false);

    try {
      const userName = localStorage.getItem("username");
      if (!userName) {
        // If the username is not found in localStorage, return early
        return;
      }

      const rewardBalance = ctsBalanceVal.reward;

      // Update streak and send reward
      updateStreak(userName, rewardBalance.toString());

      const currentTime = Date.now();
      const lastTaskCompletedTime2 = Number(
        localStorage.getItem("lastTaskCompletedTime")
      );

      // Ensure that lastTaskCompletedTime2 is a valid number
      if (isNaN(lastTaskCompletedTime2)) {
        console.error("Invalid lastTaskCompletedTime in localStorage");
        return;
      }

      const timeElapsed = currentTime - lastTaskCompletedTime2;

      console.log(
        "Time elapsed:",
        timeElapsed,
        "Last task completed time:",
        lastTaskCompletedTime2
      );

      // If the task was completed recently (within the last 24 hours), adjust the timer to reflect the time left
      if (timeElapsed < 86400000) {
        // 86400000 ms = 24 hours (1 day)
        const remainingTime = 86400 - Math.floor(timeElapsed / 1000); // Subtract elapsed time from 24 hours (in seconds)
        localStorage.setItem("InitialTime", remainingTime.toString()); // Save the remaining time to localStorage as a string
        console.log("Remaining time stored in localStorage:", remainingTime);
      } else {
        // If more than 24 hours have passed, reset the InitialTime to 24 hours
        localStorage.setItem("InitialTime", "86400"); // Reset to full 24 hours
        console.log("No remaining time, reset to 24 hours");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error completing task:", error);
      handleError("Something went wrong. Please try again.");
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
            const daysPassed = getStoredTimestamp("daysPassed");
            console.log(daysPassed);
            const reward =
              (daysPassed != null &&
                Array.isArray(rewards2) &&
                rewards2[daysPassed]) ||
              null;
            if (reward !== null) {
              handleCompleteTask(reward);
            } else {
              console.error("Invalid reward data or 'daysPassed' value");
            }
          }}
          style={butDisplay ? { display: "flex" } : { display: "none" }}
        >
          Claim
        </button>
      </div>
      <CountdownTimer
        initialTime={Number(localStorage.getItem("InitialTime")) || 86400}
        isRunning={isTimerRunning}
        onStart={handleStartTimer}
        onStop={handleStopTimer}
        onReset={handleResetTimer}
      />
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

// function getTomorrowTimestamp(timestamp: number): number {
//   // Convert the given timestamp to a Date object
//   const currentDate = new Date(timestamp);

//   // Add one day to the current date
//   currentDate.setDate(currentDate.getDate() + 1);

//   // Return the timestamp for tomorrow's date
//   return currentDate.getTime();
// }

// // console.log(getTomorrowTimestamp(1735995533006));
// // console.log(getTomorrowTimestamp(1736081933006));
// // console.log(getTomorrowTimestamp(1736168333006));
// console.log(getTomorrowTimestamp(1736254733006));

// Today: 1735995533006
// Tomorrow: 1735995533006 + 86,400,000 = 1736081933006
// Day 2: 1736081933006 + 86,400,000 = 1736168333006
// Day 3: 1736168333006 + 86,400,000 = 1736254733006
// Day 4: 1736254733006 + 86,400,000 = 1736341133006
// Day 5: 1736341133006 + 86,400,000 = 1736427533006
// Day 6: 1736427533006 + 86,400,000 = 1736513933006
// Day 7: 1736513933006 + 86,400,000 = 1736600333006

// Helper functions
const getStoredTimestamp = (cookieName: string): number | null => {
  const cookieValue = getCookie(cookieName);
  return cookieValue ? parseInt(cookieValue.slice(1), 10) : null;
};
