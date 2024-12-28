import { useEffect } from "react";
import axios from "axios";
import "../styles.css";

// interface Task {
//   _id: string;
//   task: string;
//   reward: number;
//   url?: string;
// }

interface NotdustTaskListProps {
  onTaskComplete: (taskId: string) => void;
  taskType: string;
}

const NotdustTaskList: React.FC<NotdustTaskListProps> = ({ taskType }) => {
  // const NotdustTaskList: React.FC<NotdustTaskListProps> = ({ onTaskComplete, taskType }) => {
  // const [tasks, setTasks] = useState<Task[]>([]);
  // const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  // const [showWarning, setShowWarning] = useState(false);
  // const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
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

        console.log(response);

        // setTasks(response.data.tasks);
        // setCompletedTasks(response.data.completedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [taskType]);

  // const handleCompleteTask = async (task: Task) => {
  //   const { _id, reward } = task;

  //   try {
  //     const userName = localStorage.getItem('username');
  //     if (!userName) {
  //       alert("User not found. Please sign in again.");
  //       return;
  //     }

  //     await axios.post(`${import.meta.env.VITE_API_URL}/tasks/complete/${_id}`, { userName });

  //     setCompletedTasks([...completedTasks, task]);
  //     setTasks(tasks.filter(t => t._id !== _id));

  //     const currentBalance = parseInt(localStorage.getItem('ctsBalance') || '0', 10);
  //     const newBalance = currentBalance + reward;
  //     localStorage.setItem('ctsBalance', newBalance.toString());

  //     onTaskComplete(_id);
  //   } catch (error) {
  //     console.error("Error completing task:", error);
  //   }
  // };

  const handleTaskClick = () => {
    alert("hello world");
  };
  // const handleTaskClick = (task: Task) => {
  //   if (completedTasks.some(t => t._id === task._id)) {
  //     alert("Task has already been completed.");
  //     return;
  //   }

  //   // setCurrentTask(task);
  //   // setShowWarning(true);

  //   // Open the task URL in a new tab
  //   window.open(task.url, '_blank');

  //   // Start a timer to complete the task after 30 seconds
  //   setTimeout(() => {
  //     handleCompleteTask(task);
  //     // setShowWarning(false);
  //     // setCurrentTask(null);
  //   }, 5000); // 5000 milliseconds = 5 seconds
  // };

  return (
    <div className="notdustTaskList" style={{ marginTop: "20px" }}>
      <h2>Tasks</h2>
      <div className="clickerCont">
        <div className="first">
          <img src="src\assets\ppo.png" alt="" />
          <div className="data">
            <p>user id</p>
            <h4>dhfoishiq3hhdoifhiaohfd</h4>
          </div>
          <div className="icon icon2">🐱‍👤</div>
        </div>
        <div className="second">
          <div className="texts">
            <div className="icon">🐱‍👤</div>
            <div className="others">
              <h5>Watch full ADS & CLICK</h5>
              <span>To get free CTX</span>
            </div>
          </div>
          <button
            onClick={() => {
              handleTaskClick();
            }}
          >
            Click to watch
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotdustTaskList;
