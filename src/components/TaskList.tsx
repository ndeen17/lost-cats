// src/components/TaskList.tsx
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const TaskList = () => {
    const { updateCtsBalance } = useUser();
    const [tasks, setTasks] = useState([
        { id: 1, task: 'Join our Telegram group', reward: 500 },
        { id: 2, task: 'Follow us on Twitter', reward: 600 },
        { id: 3, task: 'Like our Facebook page', reward: 700 },
        { id: 4, task: 'Share our post on Instagram', reward: 800 },
        { id: 5, task: 'Subscribe to our newsletter', reward: 900 },
        { id: 6, task: 'Visit our website', reward: 1000 },
        { id: 7, task: 'Download our app', reward: 1100 },
        { id: 8, task: 'Participate in our survey', reward: 1200 },
        { id: 9, task: 'Watch our promotional video', reward: 1300 },
        { id: 10, task: 'Give feedback on our service', reward: 1400 },
    ]);

    // Handle task completion
    const handleCompleteTask = (taskId: number, reward: number) => {
        // Remove completed task from the list
        setTasks(tasks.filter(task => task.id !== taskId));
        
        // Update CTS balance
        updateCtsBalance(reward);
    };

    return (
        <div style={{ marginTop: '20px' }}>
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
                        backgroundColor: '#fff',
                    }}>
                        <span style={{ flex: 1 }}>{task.task}</span>
                        <button
                            onClick={() => handleCompleteTask(task.id, task.reward)}
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
        </div>
    );
};

export default TaskList;
