import { useEffect, useState } from 'react';
import logo from '../assets/Non.png';

const InvitePage = () => {
    const [inviteLink, setInviteLink] = useState('');
    const [error, setError] = useState<string | null>(null);
    const userName = localStorage.getItem('username'); // Get username from local storage

    useEffect(() => {
        const fetchInviteData = async () => {
            try {
                const response = await fetch(`/api/invite-data?userName=${userName}`);
                const data = await response.json();
                if (response.ok) {
                    setInviteLink(data.inviteLink);
                } else {
                    setError(data.message || "Failed to load invite data.");
                }
            } catch (error) {
                console.error("Error fetching invite data:", error);
                setError("Unable to fetch invite data.");
            }
        };

        fetchInviteData();
    }, [userName]);

    const generateInviteLink = async () => {
        try {
            const response = await fetch('/api/generate-invite-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName }),
            });
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied to clipboard!");
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 'bold' }}>Invite Friends to Get More NDT</h2>
            <img src={logo} alt="Logo" style={{ margin: '20px', width: '150px' }} />

            {/* Display invite link or button */}
            {inviteLink ? (
                <div>
                    <p>Share this link with your friends:</p>
                    <input type="text" readOnly value={inviteLink} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #000' }} />
                    <button onClick={copyToClipboard} style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#000', color: '#fff' }}>
                        Copy Link
                    </button>
                </div>
            ) : (
                <button onClick={generateInviteLink} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#000', color: '#fff' }}>
                    Generate Invite Link
                </button>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default InvitePage;
