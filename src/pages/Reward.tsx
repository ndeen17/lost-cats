import { useNavigate } from 'react-router-dom';

const Reward = () => {
    const navigate = useNavigate();

    return (
            <div
                style={{
                    padding: '20px',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.8) 50%, #7d0000 100%)',
                    color: '#ffffff',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                {/* Calendar Icon */}
                <div
                    style={{
                        fontSize: '5vw',
                        marginBottom: '20px',
                    }}
                >
                    📅
                </div>
    
                {/* Header */}
                <h1
                    style={{
                        fontSize: '5vw',
                        margin: '10px 0',
                        lineHeight: '1.2',
                    }}
                >
                    Daily Reward
                </h1>
    
                {/* Subtitle */}
                <p
                    style={{
                        fontSize: '2.5vw',
                        margin: '10px 0 20px',
                    }}
                >
                    Gain more NDT with daily login streaks
                </p>
    
                {/* Day Display */}
                <div
                    style={{
                        fontSize: '6vw',
                        margin: '20px 0',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        border: '2px solid #fff',
                    }}
                >
                    Day 1
                </div>
    
                {/* Motivational Text */}
                <p
                    style={{
                        fontSize: '3vw',
                        marginTop: '20px',
                        fontStyle: 'italic',
                    }}
                >
                    We believe in you
                </p>
    
                {/* Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        color: '#fff',
                        backgroundColor: '#007bff',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        fontSize: '3vw',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        marginTop: '30px',
                        border: 'none',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    };
    
    export default Reward;