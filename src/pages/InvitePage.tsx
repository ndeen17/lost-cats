import { useEffect, useState } from 'react';
import logo from '../assets/Non.png';

const InvitePage = () => {
    const [inviteCount, setInviteCount] = useState(0);
    const [totalCTS, setTotalCTS] = useState(0);
    const [inviteLink, setInviteLink] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Fetch user invite data on component mount
    useEffect(() => {
        const fetchInviteData = async () => {
            try {
                const response = await fetch('/api/invite-data'); // Update with your API endpoint
                const data = await response.json();
                if (response.ok) {
                    setInviteCount(data.inviteCount);
                    setTotalCTS(data.ctsEarned);
                } else {
                    setError(data.message || "Failed to load invite data.");
                }
            } catch (error) {
                console.error("Error fetching invite data:", error);
                setError("Unable to fetch invite data.");
            }
        };

        fetchInviteData();
    }, []);

    // Function to generate invite link
    const generateInviteLink = async () => {
        try {
            const response = await fetch('/api/generate-invite-link', { method: 'POST' });
            const data = await response.json();
            if (response.ok) {
                setInviteLink(data.inviteLink);
            } else {
                setError(data.message || "Failed to generate invite link.");
            }
        } catch (error) {
            console.error("Error generating invite link:", error);
            setError("Unable to generate invite link.");
        }
    };

    // Copy invite link to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied to clipboard!");
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 'bold' }}>Invite Friends to Get More CTS</h2>
            <img src={logo} alt="Logo" style={{ margin: '20px', width: '150px' }} />

            <h3>Total Friends Invited: {inviteCount}</h3>
            <p>Total CTS Earned: {totalCTS}</p>

            {/* Display invite link or invitation button */}
            {inviteCount === 0 ? (
                <div>
                    <button onClick={generateInviteLink} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#000', color: '#fff' }}>
                        Invite Friends
                    </button>
                    {inviteLink && (
                        <div style={{ marginTop: '20px' }}>
                            <p>Share this link with your friends:</p>
                            <input type="text" readOnly value={inviteLink} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #000' }} />
                            <button onClick={copyToClipboard} style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#000', color: '#fff' }}>
                                Copy Link
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={generateInviteLink} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#000', color: '#fff' }}>
                    Invite More Friends
                </button>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default InvitePage;
