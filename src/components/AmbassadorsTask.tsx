import { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  _id: string;
  task: string;
  reward: number;
  url?: string;
}

interface AmbassadorsTaskListProps {
  onTaskComplete: (taskId: string) => void;
  taskType: string;
}

const Loader = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

const AmbassadorsTaskList: React.FC<AmbassadorsTaskListProps> = ({
  onTaskComplete,
  taskType,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(false);
      try {
        const userName = localStorage.getItem("username");
        if (!userName) {
          alert("User not found. Please sign in again.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tasks`,
          {
            params: { userName, taskType },
          }
        );
        setLoading(false);
        setTasks(response.data.tasks);
        setCompletedTasks(response.data.completedTasks);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [taskType]);

  const handleCompleteTask = async (task: Task) => {
    const { _id, reward } = task;

    try {
      const userName = localStorage.getItem("username");
      if (!userName) {
        alert("User not found. Please sign in again.");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/complete/${_id}`,
        { userName }
      );

      setCompletedTasks([...completedTasks, task]);
      setTasks(tasks.filter((t) => t._id !== _id));

      const currentBalance = parseInt(
        localStorage.getItem("ctsBalance") || "0",
        10
      );
      const newBalance = currentBalance + reward;
      localStorage.setItem("ctsBalance", newBalance.toString());

      onTaskComplete(_id);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleTaskClick = (task: Task) => {
    if (completedTasks.some((t) => t._id === task._id)) {
      alert("Task has already been completed.");
      return;
    }

    setCurrentTask(task);
    setShowWarning(true);

    // Open the task URL in a new tab
    window.open(task.url, "_blank");

    // Start a timer to complete the task after 30 seconds
    setTimeout(() => {
      handleCompleteTask(task);
      setShowWarning(false);
      setCurrentTask(null);
    }, 5000); // 5000 milliseconds = 5 seconds
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Add any additional content you want to show when data is loaded */}
        </div>
      )}
      <h2>Tasks</h2>
      {tasks.length < 0 ? (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 20px",
              margin: "10px 0",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                color: "#000",
                textDecoration: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                backgroundColor: "#f0f0f0",
                marginRight: "10px",
              }}
              onClick={() => handleTaskClick(task)}
            >
              {task.task} + {task.reward} NDT
            </a>
          </div>
        ))
      ) : (
        <p>More tasks coming soon</p>
      )}

      <h2>Completed Tasks</h2>
      {completedTasks.length > 0 ? (
        completedTasks.map((task) => (
          <div
            key={task._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 20px",
              margin: "10px 0",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              color: "black",
              backgroundColor: "#fff",
            }}
          >
            <span style={{ flex: 1 }}>{task.task}</span>
            <span>{task.reward} NDT</span>
          </div>
        ))
      ) : (
        <p>No completed tasks</p>
      )}

      {showWarning && currentTask && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p>Make sure tasks are done properly!</p>
            <button
              onClick={() => setShowWarning(false)}
              style={{
                padding: "8px 15px",
                borderRadius: "5px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbassadorsTaskList;
