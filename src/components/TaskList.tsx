import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

interface Task {
    id: number;
    task: string;
    reward: number;
    url?: string;
}

const TaskList = ({ onTaskComplete }: { onTaskComplete: (taskId: number) => void }) => {
    const { updateCtsBalance } = useUser();
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, task: 'Join our Telegram group', reward: 500, url: 'https://telegram.org' },
        { id: 2, task: 'Follow us on Twitter', reward: 600, url: 'https://twitter.com' },
        { id: 3, task: 'Like our Facebook page', reward: 700, url: 'https://facebook.com' },
        { id: 4, task: 'Share our post on Instagram', reward: 800, url: 'https://instagram.com' },
        { id: 5, task: 'Subscribe to our newsletter', reward: 900 },
        { id: 6, task: 'Visit our website', reward: 1000, url: 'https://example.com' },
        { id: 7, task: 'Download our app', reward: 1100 },
        { id: 8, task: 'Participate in our survey', reward: 1200, url: 'https://example.com/survey' },
        { id: 9, task: 'Watch our promotional video', reward: 1300 },
        { id: 10, task: 'Give feedback on our service', reward: 1400, url: 'https://example.com/feedback' },
    ]);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleCompleteTask = (taskId: number, reward: number) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        updateCtsBalance(reward);
        onTaskComplete(taskId); // Notify the parent component (DashboardPage)
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