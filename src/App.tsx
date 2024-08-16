// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import InvitePage from './pages/InvitePage';
import LeaderboardPage from './pages/LeaderboardPage'; // Import LeaderboardPage

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/invite" element={<InvitePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} /> {/* Add LeaderboardPage Route */}
            </Routes>

            {/* Footer Navigation */}
            <footer style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '10px',
                borderTop: '1px solid #000',
                backgroundColor: '#000',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                zIndex: 1000,
            }}>
                <NavLink to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }} activeStyle={{ color: '#00f' }}>
                    <span style={{ display: 'block', textAlign: 'center' }}>
                        Home
                        <i className="fas fa-home" style={{ marginLeft: '5px' }}></i>
                    </span>
                </NavLink>
                <NavLink to="/tasks" style={{ color: '#fff', textDecoration: 'none' }} activeStyle={{ color: '#00f' }}>
                    <span style={{ display: 'block', textAlign: 'center' }}>
                        Earn
                        <i className="fas fa-dollar-sign" style={{ marginLeft: '5px' }}></i>
                    </span>
                </NavLink>
                <NavLink to="/invite" style={{ color: '#fff', textDecoration: 'none' }} activeStyle={{ color: '#00f' }}>
                    <span style={{ display: 'block', textAlign: 'center' }}>
                        Invite Friends
                        <i className="fas fa-user-plus" style={{ marginLeft: '5px' }}></i>
                    </span>
                </NavLink>
                <NavLink to="/leaderboard" style={{ color: '#fff', textDecoration: 'none' }} activeStyle={{ color: '#00f' }}>
                    <span style={{ display: 'block', textAlign: 'center' }}>
                        Leaderboard
                        <i className="fas fa-trophy" style={{ marginLeft: '5px' }}></i>
                    </span>
                </NavLink>
            </footer>
        </Router>
    );
};

export default App;
