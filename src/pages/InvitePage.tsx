// src/pages/InvitePage.tsx
//import { useState } from 'react';

const InvitePage = () => {
    // const [inviteLink, setInviteLink] = useState('');

    // const generateInviteLink = () => {
    //     const link = `https://example.com/invite/${Math.random().toString(36).substr(2, 9)}`;
    //     setInviteLink(link);
    // };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Invite Your Friends</h2>

            {/* Coming Soon Message */}
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF0000', margin: '20px 0' }}>
                Coming Soon!
            </div>

            {/* Commented out the invite link generation button and input */}
            {/* 
            <button
                onClick={generateInviteLink}
                style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Generate Invite Link
            </button>
            {inviteLink && (
                <div style={{ marginTop: '20px' }}>
                    <p>Share this link with your friends:</p>
                    <input
                        type="text"
                        readOnly
                        value={inviteLink}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #000' }}
                    />
                </div>
            )} 
            */}
        </div>
    );
};

export default InvitePage;
