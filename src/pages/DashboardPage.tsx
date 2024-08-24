// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import TaskSlider from '../components/TaskSlider';

const DashboardPage = () => {
    const { userName, ctsBalance } = useUser();
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        // Retrieve tasks from localStorage or any other source
        const tasksData = JSON.parse(localStorage.getItem('tasks') || '[]');
        setTasks(tasksData);
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
            {/* Displaying user name */}
            <h1 style={{ textAlign: 'center', fontSize: '28px', margin: '20px 0' }}>Hello, {userName}</h1>
            
            {/* Displaying CTS balance */}
            <h2 style={{ textAlign: 'center', fontSize: '22px', margin: '20px 0' }}>Your CTS Balance: {ctsBalance}</h2>

            {/* Display Task Slider */}
            {tasks.length > 0 ? <TaskSlider tasks={tasks} /> : <p style={{ textAlign: 'center' }}>No tasks available</p>}
        </div>
    );
};

export default DashboardPage;
