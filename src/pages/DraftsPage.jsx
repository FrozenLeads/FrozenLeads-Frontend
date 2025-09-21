import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api.js';

const DraftsPage = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sendingId, setSendingId] = useState(null);

    const fetchDrafts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/track/drafts');
            setDrafts(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch drafts.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrafts();
    }, [fetchDrafts]);

    const handleSendDraft = async (draftId) => {
        setSendingId(draftId);
        try {
            // The request is now very simple.
            await api.post('/track/send-draft', { draftId });
            alert('Email sent successfully and is now being tracked!');
            fetchDrafts();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to send draft.');
        } finally {
            setSendingId(null);
        }
    };

    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500 p-8">Loading your drafts...</p>;
        if (error) return <p className="text-center text-red-500 p-8">{error}</p>;
        if (drafts.length === 0) {
            return (
                <div className="text-center text-gray-500 p-8">
                    <h3 className="text-lg font-semibold text-gray-700">No drafts found.</h3>
                    <p>Write an email in Gmail, save it as a draft, then refresh.</p>
                </div>
            );
        }
        return (
            <ul className="divide-y divide-gray-200">
                {drafts.map((draft) => (
                    <li key={draft.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate" title={draft.subject}>{draft.subject}</p>
                            <p className="text-sm text-gray-600 truncate" title={draft.to}>To: {draft.to}</p>
                        </div>
                        <button
                            onClick={() => handleSendDraft(draft.id)}
                            disabled={sendingId === draft.id}
                            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                        >
                            {sendingId === draft.id ? 'Sending...' : 'Send & Track'}
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Send from Drafts</h1>
                <button onClick={fetchDrafts} disabled={loading} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                    Refresh
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default DraftsPage;