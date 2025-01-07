import React, { useState, useEffect } from "react";
import "../styles.css"; // Import SCSS for styling

interface CountdownTimerProps {
  initialTime: number; // Time in seconds to start the countdown
  isRunning: boolean; // External control to start/stop the timer
  onStart: () => void; // Start the timer function
  onStop: () => void; // Stop the timer function
  onReset: () => void; // Reset the timer function
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime,
  isRunning,
  //   onStart,
  onStop,
  //   onReset,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime * 1000); // Time in milliseconds
  //   const [isFading, setIsFading] = useState<boolean>(false); // Track fade animation

  useEffect(() => {
    let timer: NodeJS.Timeout;
    console.log(initialTime);
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1000); // Decrease by 1000ms (1 second)
      }, 1000); // Update every second
    } else if (timeLeft === 0) {
      setTimeLeft(0);
      onStop(); // Stop the timer once it reaches zero
    }

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [isRunning, timeLeft, onStop]);

  // Save start time when the timer starts
  //   const startTimer = () => {
  //     const startTime = Date.now();
  //     const endTime = startTime + initialTime * 1000; // Add the initial time in milliseconds

  //     localStorage.setItem("startTime", startTime.toString());
  //     localStorage.setItem("endTime", endTime.toString());
  //   };

  //   const resetTimer = () => {
  //     setTimeLeft(initialTime * 1000); // Reset the time to the initial value (in milliseconds)
  //     localStorage.removeItem("startTime");
  //     localStorage.removeItem("endTime"); // Clear stored times
  //   };

  // Helper function to convert milliseconds to hh:mm:ss format
  const formatTime = (timeInMilliseconds: number) => {
    const hours = Math.floor(timeInMilliseconds / (1000 * 3600));
    const minutes = Math.floor(
      (timeInMilliseconds % (1000 * 3600)) / (1000 * 60)
    );
    const seconds = Math.floor((timeInMilliseconds % (1000 * 60)) / 1000);
    // Return the formatted time in hh:mm:ss format
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="countdown-timer-container">
      <p
        className={`countdown-timer-display ${
          timeLeft <= 10000 ? "danger" : ""
        }`}
      >
        {formatTime(timeLeft)}
      </p>
      {/* <div className="countdown-timer-controls">
        {!isRunning && <button onClick={startTimer}>Start</button>}
        {isRunning && <button onClick={onStop}>Stop</button>}
        <button onClick={onReset}>Reset</button>
      </div> */}
    </div>
  );
};

export default CountdownTimer;
