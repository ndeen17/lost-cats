
import { useUser } from '../context/UserContext';
import FarmButton from '../components/FarmButton'; // Import FarmButton component
import logo from '../assets/logo.png';

const DashboardPage = () => {
    const { userName, ctsBalance } = useUser();

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

            {/* Display the FarmButton */}
            <FarmButton /> {/* Replacing TaskSlider with FarmButton */}
        </div>
    );
};

export default DashboardPage;
