import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Non.png";
import "../styles.css";

const WelcomePage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     const cookieName = "timestampCookie";
  //     // Check if the cookie exists
  //     let cookieValue = getCookie(cookieName);

  //     if (!cookieValue) {
  //       //   console.log("cookie ooo");
  //       // If no cookie, create a new cookie with the current timestamp
  //       //   const currentTimestamp = Date.now(); // milliseconds
  //       //   setCookie(cookieName, currentTimestamp.toString(), 7); // Expires in 7 days
  //       //   setDaysPassed(1); // It's day 1 when the cookie is first set
  //     } else {
  //       // Cookie exists, calculate the difference in days
  //       const storedTimestamp = parseInt(
  //         cookieValue.slice(1, cookieValue.length),
  //         10
  //       );
  //       // console.log(storedTimestamp)
  //       if (isNaN(storedTimestamp)) {
  //         console.error("Invalid timestamp in cookie.");
  //         return;
  //       }
  //       const currentTimestamp = Date.now();
  //       console.log(currentTimestamp);
  //       // const currentTimestamp =1734966862568   //3 days timeline

  //       const diffInMilliseconds = currentTimestamp - storedTimestamp;
  //       const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  //       setDaysPassed(diffInDays + 1);
  //       console.log(diffInDays + 1);
  //       // Update the cookie with the new day count
  //       // setCookie(cookieName, storedTimestamp.toString(), 7); // The timestamp remains the same, only the day count changes
  //     }
  //   }, []);

  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   if (storedUsername) {
  //     navigate("/dashboard"); // Redirect to dashboard if already signed in
  //   }
  // }, [navigate]);

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const COOKIE_NAME = "timestampCookie";
  const COOKIE_TODAY = "cookieToday";
  const COOKIE_DAY = "cookieDay";

  const setCookieWithExpiry = (
    cookieName: string,
    value: string,
    days: number
  ): void => {
    setCookie(cookieName, value, days);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        //  // Redirect to dashboard if already signed in
        try {
          const checkRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/check/${storedUsername}`
          );

          if (!checkRes.data.exists) {
            localStorage.setItem("username", "");
            localStorage.setItem("ctsBalance", "");
            setCookieWithExpiry(COOKIE_NAME, "", -1); // 7 days expiry
            setCookieWithExpiry(COOKIE_TODAY, "", -1); // 1 day expiry
            setCookieWithExpiry(COOKIE_DAY, "1", -1); // 7 days expiry
            // console.log(false);
            navigate("/"); // Redirect to the welcome page if the user doesn't exist
            return;
          } else {
            // console.log(true);
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data.");
        }
      }
    };

    fetchUserData(); // Call the async function
  }, [navigate]);

  const handleSignIn = async () => {
    if (!username) {
      setError("Username cannot be empty");
      return;
    }

    try {
      // Log the username being sent
      console.log("Username being sent:", username);

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        userName: username,
      });
      setCookieWithExpiry(COOKIE_NAME, "", -1); // 7 days expiry
      setCookieWithExpiry(COOKIE_TODAY, "", -1); // 1 day expiry
      setCookieWithExpiry(COOKIE_DAY, "", -1);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error during sign-in:", err); // Log the error for debugging
      setError("Failed to sign in. Try again.");
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#7d0000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
      className="welcomePage"
    >
      <img
        src={logo}
        alt="logo"
        style={{ maxWidth: "200px", height: "auto" }}
      />
      <h1>Welcome to the Game!</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        // style={{ padding: "10px", margin: "10px 0", borderRadius: "5px" }}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default WelcomePage;
