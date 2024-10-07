import { useState, useEffect } from 'react';
import axios from 'axios';

// Define Task interface to ensure type safety
interface Task {
    id: string; // Change id type to string
    task: string;
    reward: number;
    url?: string;
}

const TaskList = ({ onTaskComplete }: { onTaskComplete: (taskId: string) => void }) => { // Change onTaskComplete type
    const [tasks, setTasks] = useState<Task[]>([]); // State to hold tasks fetched from the backend
    const [completedTasks, setCompletedTasks] = useState<string[]>([]); // Store completed task IDs as strings
    const [showWarning, setShowWarning] = useState(false); // Toggle for showing modal
    const [currentTask, setCurrentTask] = useState<{ id: string, reward: number, url?: string } | null>(null); // Store task data

    // Fetch tasks from backend on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
                setTasks(response.data); // Assuming the response data is an array of tasks
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    // Add logging to confirm the API URL
    useEffect(() => {
        console.log('API URL:', import.meta.env.VITE_API_URL);
    }, []);

    // Handle task completion after modal confirmation
    const handleCompleteTask = async () => {
        if (!currentTask) return;

        const { id, reward } = currentTask;

        try {
            // Get username from local storage
            const userName = localStorage.getItem('username');
            if (!userName) {
                alert("User not found. Please sign in again.");
                return;
            }

            // Notify the backend about task completion
            await axios.post(`${import.meta.env.VITE_API_URL}/tasks/complete/${id}`, { userName });

            // Update completed tasks list
            setCompletedTasks([...completedTasks, id]);

            // Update the CTS balance for the user
            const currentBalance = parseInt(localStorage.getItem('ctsBalance') || '0', 10);
            const newBalance = currentBalance + reward; // Update the balance with reward
            localStorage.setItem('ctsBalance', newBalance.toString());

            // Notify parent component (if necessary)
            onTaskComplete(id); // Pass id as a string
        } catch (error) {
            console.error("Error completing task:", error);
        }

        // Close the modal
        setShowWarning(false);
        setCurrentTask(null);
    };

    // Open modal and set the current task
    const handleOpenWarning = (taskId: string, reward: number, url?: string) => { // Change taskId type to string
        setCurrentTask({ id: taskId, reward, url });
        setShowWarning(true);
    };

    return (
        <div style={{ marginTop: '20px' }}>
            {/* Display the tasks if available */}
            {tasks.length > 0 ? (
                tasks
                    .filter(task => !completedTasks.includes(task.id)) // Exclude completed tasks
                    .map(task => (
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
                                onClick={() => handleOpenWarning(task.id, task.reward, task.url)} // Pass task.id as string
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
                <p>No tasks available</p>
            )}

            {/* Modal for warning */}
            {showWarning && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        maxWidth: '400px',
                        width: '100%',
                    }}>
                        <h3>Warning</h3>
                        <p>Hey! If you cheat, your account would be deleted.</p>
                        <button
                            onClick={handleCompleteTask}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px',
                            }}
                        >
                            Proceed
                        </button>
                        <button
                            onClick={() => setShowWarning(false)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#fff',
                                color: '#000',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
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

export default TaskList;
