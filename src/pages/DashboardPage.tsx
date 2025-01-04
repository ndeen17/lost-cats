import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Non.png";
import { ToastContainer, toast } from "react-toastify";
import "../styles.css";

const Dashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [ctsBalance, setCtsBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize navigate

  const fetchUserData = async () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      try {
        const checkRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/check/${storedUsername}`
        );

        if (!checkRes.data.exists) {
          localStorage.setItem("username", "");
          localStorage.setItem("ctsBalance", "");
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
          }, 500); // Redirect to the welcome page
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${storedUsername}`
        );
        setUsername(res.data.userName);
        setCtsBalance(res.data.ctsBalance);
        localStorage.setItem("username", res.data.userName);
        localStorage.setItem("ctsBalance", res.data.ctsBalance.toString());
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
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
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   // Check local storage and fetch data only if necessary
  //   fetchUserData();

  //   // Set an interval to refetch user data every 60 seconds
  //   const intervalId = setInterval(() => {
  //     fetchUserData();
  //   }, 60000);

  //   // Clear the interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <div className="cont">
      <ToastContainer />
      <div className="wrapper"></div>
      <div className="star-background">
        <div style={{ marginBottom: "10px" }}>
          <img
            src={logo}
            alt="logo"
            style={{ minWidth: "100px", maxWidth: "200px", height: "auto" }}
          />
        </div>
        <h1 style={{ fontSize: "6vw", lineHeight: "1.2" }}>
          Welcome, {username || "Guest"}!
        </h1>
        {ctsBalance !== null && (
          <p style={{ fontSize: "4vw", margin: "10px 0 20px" }}>
            Your current balance: {ctsBalance} $NDT
          </p>
        )}
        {error && <div style={{ color: "red", fontSize: "3vw" }}>{error}</div>}
        <div className="star-background-inner" style={{ marginTop: "10px" }}>
          <a
            href="/daily-reward"
            style={{
              color: "#aaf0ff", // Light blue text
              fontSize: "4vw", // Scalable font size
              textDecoration: "none", // No underline
              transition: "background-color 0.3s, transform 0.3s", // Smooth transitions
              display: "flex", // Flex for alignment
              justifyContent: "center", // Center text horizontally
              alignItems: "center", // Center text vertically
              padding: "15px 30px", // Button padding
              backgroundColor: "#440000", // Dark red background
              borderRadius: "50px", // Fully rounded corners
              border: "2px solid #aaf0ff", // Light blue border
              width: "fit-content", // Adjust to content size
              // margin: "20px auto", // Center horizontally with margin
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#aaf0ff"; // Light blue background
              e.currentTarget.style.color = "#440000"; // Dark red text
              e.currentTarget.style.transform = "scale(1.05)"; // Slight scaling
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#440000"; // Reset to original
              e.currentTarget.style.color = "#aaf0ff"; // Reset text color
              e.currentTarget.style.transform = "scale(1)"; // Reset scale
            }}
          >
            DAILY REWARD
          </a>
          {/* <a href="/tasks" className="tasks2">
            Earn With Tasks <span className="arrow">→</span>
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
