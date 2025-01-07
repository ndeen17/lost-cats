import { useState, useEffect } from "react";

// Helper functions to work with cookies
const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : undefined;
};

const setCookie = (name: string, value: string, minutes: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + minutes * 60 * 1000); // Expire in `minutes`
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const COOKIE_NAME = "timestampCookie22";
const COOKIE_TODAY = "cookieToday22";
const COOKIE_DAY = "cookieDay22";

// Helper function to get stored timestamp from cookies
const getStoredTimestamp = (cookieName: string): number | null => {
  const cookieValue = getCookie(cookieName);
  return cookieValue ? parseInt(cookieValue, 10) : null;
};

// Helper function to set cookies with expiry
const setCookieWithExpiry = (
  cookieName: string,
  value: string,
  minutes: number
): void => {
  setCookie(cookieName, value, minutes);
};

// Timer function to calculate time left
const calculateTimeLeft = (targetTimestamp: number): number => {
  const currentTimestamp = Date.now();
  const timeLeft = targetTimestamp - currentTimestamp;

  if (timeLeft <= 0) {
    // If time is up, reset and move to the next day
    return 0;
  }

  return timeLeft;
};

// Main component
const RewardSystem: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [daysPassed, setDaysPassed] = useState<number>(0); // Default to Day 1
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canPerformTask, setCanPerformTask] = useState<boolean>(false);

  // Initialize the countdown timer and cookies
  useEffect(() => {
    const storedTimestamp = getStoredTimestamp(COOKIE_NAME);
    const storedDay = getStoredTimestamp(COOKIE_DAY);
    const storedToday = getStoredTimestamp(COOKIE_TODAY);
    const currentTimestamp = Date.now();

    if (!storedTimestamp && !storedToday && !storedDay) {
      // If all cookies are missing, initialize the cookies
      const newTimestamp = currentTimestamp.toString();
      setCookieWithExpiry(COOKIE_NAME, newTimestamp, 14); // Set timestamp cookie for 14 minutes
      setCookieWithExpiry(COOKIE_DAY, "1", 14); // Start on day 1
      setDaysPassed(1); // Default to Day 1
    } else if (storedTimestamp && storedToday && storedDay) {
      // If all cookies exist, check if the user can perform a task
      const diffInMilliseconds = currentTimestamp - storedTimestamp;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
      console.log(diffInDays);
      console.log(storedDay);
      setDaysPassed(storedDay);
      if (diffInDays >= 1 && storedToday) {
        // Cookie Today has expired, user can perform a task only if the timestamp aligns with the stored day
        const storedDayValue = storedDay
          ? parseInt(storedDay.toString(), 10)
          : 1;

        // Check if the user can perform the next task
        if (diffInDays === storedDayValue - 1) {
          setCanPerformTask(true);
        } else {
          // Reset if day mismatch
          resetCookies();
        }
      } else if (storedToday) {
        // User cannot perform a task today if cookieToday still exists
        setCanPerformTask(false);
      }
    } else if (storedTimestamp && !storedToday && storedDay) {
      // If timestamp and day cookies are set but cookieToday is missing
      const diffInMilliseconds = currentTimestamp - storedTimestamp;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days

      if (diffInDays + 1 === storedDay) {
        // Check if enough time has passed to allow user to perform the task
        setCanPerformTask(true);
      } else {
        // Reset if time hasn't passed enough for task
        resetCookies();
      }
    }

    // Set interval to check every second
    const intervalId = setInterval(() => {
      const targetTimestamp = storedTimestamp ? storedTimestamp + 120000 : 0; // 120000 ms = 2 minutes
      const remainingTime = calculateTimeLeft(targetTimestamp);
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        const targetTimestamp = storedTimestamp ? storedTimestamp + 120000 : 0; // 120000 ms = 2 minutes
        const remainingTime = calculateTimeLeft(targetTimestamp);
        const storedDay = getStoredTimestamp(COOKIE_DAY);
        setTimeLeft(remainingTime);
        // Time's up, reset to next day
        setDaysPassed(Number(storedDay));
        setCookieWithExpiry(COOKIE_TODAY, "", -1);
        setCookieWithExpiry(COOKIE_DAY, `${daysPassed + 1}`, 14); // 14 minutes expiry
        setCookieWithExpiry(COOKIE_NAME, Date.now().toString(), 14); // Update timestamp for the next day
      }
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [daysPassed]);

  const resetCookies = () => {
    setCookieWithExpiry(COOKIE_NAME, "", -1);
    setCookieWithExpiry(COOKIE_TODAY, "", -1);
    setCookieWithExpiry(COOKIE_DAY, "", -1);
    setCanPerformTask(false);
  };

  // Function to handle the completion of the task
  const completeTask = () => {
    setCookieWithExpiry(COOKIE_TODAY, Date.now().toString(), 1); // Set today's task timestamp
    setCookieWithExpiry(COOKIE_DAY, `${daysPassed + 1}`, 14); // Move to the next task day
    setCanPerformTask(false); // Disable task until the next available time
    setIsLoading(false); // End loading
  };

  // Format the time left (mm:ss)
  const formatTime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <div>
      <h2>Day {daysPassed}</h2>
      <p>Time Left: {formatTime(timeLeft)}</p>
      <button onClick={completeTask} disabled={!canPerformTask || isLoading}>
        {isLoading ? "Processing..." : "Complete Task"}
      </button>
      {!canPerformTask && (
        <p>
          You have already completed today's task or need to wait for the timer
          to reset.
        </p>
      )}
    </div>
  );
};

export default RewardSystem;
