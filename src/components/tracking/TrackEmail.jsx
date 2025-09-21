import React, { useState } from 'react';
import api from '../../api/api';

const TrackEmail = () => {
    const [to, setTo] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!to) return;
        setLoading(true);
        setMessage('');
        try {
            const response = await api.post('/track', { to });
            setMessage(`Success! Tracking started for email to ${to}.`);
            setIsError(false);
            setTo('');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to start tracking');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleTrack}>
            <input type="email" placeholder="Recipient Email" value={to} onChange={(e) => setTo(e.target.value)} className="border p-2 mb-3 w-full rounded-md" required />
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-md w-full hover:bg-green-700 disabled:bg-green-300">
                {loading ? 'Tracking...' : 'Start Tracking'}
            </button>
            {message && <p className={`mt-3 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
        </form>
    );
};

export default TrackEmail;
