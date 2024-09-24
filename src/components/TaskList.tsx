import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';

// Define Task interface to ensure type safety
interface Task {
    id: number;
    task: string;
    reward: number;
    url?: string;
}

const TaskList = ({ onTaskComplete }: { onTaskComplete: (taskId: number) => void }) => {
    const { updateCtsBalance, userName } = useUser(); // Retrieve CTS balance and userName from context

    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, task: 'Join our Telegram group', reward: 500, url: 'https://telegram.org' },
        { id: 2, task: 'Follow us on Twitter', reward: 600, url: 'https://twitter.com' },
        // Additional tasks can be added here
    ]);

    // Fetch tasks from the backend API to ensure persistence
    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`); // Updated to use environment variable for API URL
            setTasks(res.data); // Set tasks state with data from the backend
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks(); // Fetch tasks on component mount
    }, []);

    // Handle task completion
    const handleCompleteTask = async (taskId: number, reward: number, url?: string) => {
        // Ask for confirmation before marking the task as complete
        const isConfirmed = window.confirm("Are you sure you completed the task?");
        if (!isConfirmed) {
            return; // If not confirmed, do nothing
        }

        // Ask if the user clicked the task URL (if it exists)
        const taskClicked = url ? window.confirm("Did you click the link to complete the task?") : true;
        if (!taskClicked) {
            alert("You need to click the link to receive CTS."); // Alert the user to click the link
            return; // Exit if the link wasn't clicked
        }

        // If there is a URL, open it in a new tab
        if (url) {
            window.open(url, "_blank");
        }

        try {
            // Notify the backend about task completion
            await axios.post(`${process.env.REACT_APP_API_URL}/tasks/complete/${taskId}`, { userName });

            // Filter out the completed task and update the state
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks); // Update tasks list

            // Update the CTS balance for the user
            updateCtsBalance(reward);

            // Notify parent component (if necessary)
            onTaskComplete(taskId);
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            {/* Display the tasks if available */}
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <div key={task.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        margin: '10px 0',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#000',
                    }}>
                        <span style={{ flex: 1 }}>
                            {task.url ? (
                                <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                                    {task.task}
                                </a>
                            ) : (
                                <span style={{ color: '#fff' }}>{task.task}</span>
                            )}
                        </span>
                        <button
                            onClick={() => handleCompleteTask(task.id, task.reward, task.url)}
                            style={{
                                padding: '8px 15px',
                                borderRadius: '5px',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Complete +{task.reward} CTS
                        </button>
                    </div>
                ))
            ) : (
                <p>No tasks available</p> // Display this if no tasks are available
            )}
        </div>
    );
};

export default TaskList;
