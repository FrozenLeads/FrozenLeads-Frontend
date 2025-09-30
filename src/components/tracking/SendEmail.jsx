import React, { useState } from 'react';
import api from '../../api/api';

const SendEmail = () => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await api.post('/track/send', { to, subject, body });
            setMessage(res.data.message);
            // Clear form on success
            setTo('');
            setSubject('');
            setBody('');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to send.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4">Send & Track a New Email</h2>
            <form onSubmit={handleSend} className="space-y-4">
                <input type="email" placeholder="Recipient (To)" value={to} onChange={e => setTo(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border rounded" required />
                <textarea placeholder="Email Body..." value={body} onChange={e => setBody(e.target.value)} className="w-full p-2 border rounded" rows="5" required />
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:bg-green-300">
                    {loading ? 'Sending...' : 'Send and Track'}
                </button>
                {message && <p className="text-sm text-center mt-2">{message}</p>}
            </form>
        </div>
    );
};

export default SendEmail;