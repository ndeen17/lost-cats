import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../context/UserContext';

interface Task {
  id: number;
  task: string;
  reward: number;
}

const TaskSlider = ({ tasks, handleCompleteTask }: { tasks: Task[], handleCompleteTask: (taskId: number, reward: number) => void }) => {
  const { updateCtsBalance } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setCurrentTasks(tasks);
  }, [tasks]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentTasks.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + currentTasks.length) % currentTasks.length);
  };

  const handleComplete = () => {
    const task = currentTasks[currentIndex];
    handleCompleteTask(task.id, task.reward);
  };

  const currentTask = currentTasks[currentIndex];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '15px',
      borderRadius: '10px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <h2 style={{ margin: '0 0 10px', fontSize: '20px' }}>Current Task</h2>
      <p style={{ margin: '0 0 10px', fontSize: '16px' }}>{currentTask?.task || 'No tasks available'}</p>
      <p style={{ margin: '0 0 15px', fontSize: '14px', fontWeight: 'bold' }}>Reward: {currentTask?.reward || 0} CTS</p>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={handlePrevious}
          style={{
            fontSize: '20px',
            cursor: 'pointer',
            color: '#fff',
            padding: '8px',
            backgroundColor: '#333',
            borderRadius: '50%',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#555')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#333')}
        />
        <button
          onClick={handleComplete}
          style={{
            padding: '8px 15px',
            borderRadius: '5px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
        >
          Complete
        </button>
        <FontAwesomeIcon
          icon={faArrowRight}
          onClick={handleNext}
          style={{
            fontSize: '20px',
            cursor: 'pointer',
            color: '#fff',
            padding: '8px',
            backgroundColor: '#333',
            borderRadius: '50%',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#555')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#333')}
        />
      </div>
    </div>
  );
};

export default TaskSlider;
