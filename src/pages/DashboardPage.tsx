import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import TaskSlider from '../components/TaskSlider';
import logo from '../assets/logo.png';

interface Task {
    id: number;
    task: string;
    reward: number;
}

const DashboardPage = () => {
    const { userName, ctsBalance } = useUser();
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        // Retrieve tasks from localStorage or any other source
        const tasksData = JSON.parse(localStorage.getItem('tasks') || '[]');
        setTasks(tasksData);
    }, []);

    // Define the handleCompleteTask function
    const handleCompleteTask = (taskId: number, reward: number) => {
        // Logic to handle task completion
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);

        // Update the CTS balance and/or perform other necessary operations
        console.log(`Task with ID ${taskId} completed. Reward: ${reward}`);
        // You may want to add logic to update the CTS balance in the backend or frontend.
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
            {/* Display the logo */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
            </div>

            {/* Displaying user name */}
            <h1 style={{ textAlign: 'center', fontSize: '28px', margin: '20px 0' }}>Hello, {userName}</h1>
            
            {/* Displaying CTS balance */}
            <h2 style={{ textAlign: 'center', fontSize: '22px', margin: '20px 0' }}>Your CTS Balance: {ctsBalance}</h2>

            {/* Display Task Slider */}
            {tasks.length > 0 ? (
                <TaskSlider tasks={tasks} handleCompleteTask={handleCompleteTask} />
            ) : (
                <p style={{ textAlign: 'center' }}>No tasks available</p>
            )}
        </div>
    );
};

export default DashboardPage;
