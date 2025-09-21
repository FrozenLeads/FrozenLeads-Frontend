import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api.js';

const TrackingsPage = () => {
    const [trackings, setTrackings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchTrackings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/trackings');
            setTrackings(res.data);
        } catch (err) {
            console.error("Tracking fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrackings();
    }, [fetchTrackings]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await api.post('/sync-status');
            // After sync, refresh the list to see any changes.
            await fetchTrackings();
        } catch (err) {
            console.error('Sync failed:', err);
            alert('Failed to sync email statuses.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSetStatus = async (trackingId, newStatus) => {
        try {
            await api.patch(`/track/${trackingId}/status`, { status: newStatus });
            // Update the state locally for an instant UI change.
            setTrackings(prevTrackings =>
                prevTrackings.map(t =>
                    t._id === trackingId ? { ...t, status: newStatus } : t
                )
            );
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status.');
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            sent: "bg-blue-100 text-blue-800 border-blue-200",
            responded: "bg-green-100 text-green-800 border-green-200",
            ghosted: "bg-red-100 text-red-800 border-red-200",
            'follow-up': "bg-yellow-100 text-yellow-800 border-yellow-200",
            'Engaged': "bg-indigo-100 text-indigo-800 border-indigo-200",
            'not-interested': "bg-gray-200 text-gray-800 border-gray-300",
        };
        // This makes the status text look nice (e.g., "not-interested" -> "Not Interested")
        const statusText = status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        return <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{statusText}</span>;
    };

    if (loading) {
        return (
            <div className="text-center text-gray-500 p-8">
                Loading tracked emails...
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Tracked Emails</h1>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {isSyncing ? 'Syncing...' : 'Sync Status'}
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {trackings.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {trackings.map(tracking => (
                            <li key={tracking._id} className="p-4 sm:p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{tracking.subject || '(No Subject)'}</p>
                                        <p className="text-sm text-gray-600">To: {tracking.to}</p>
                                        <p className="text-xs text-gray-400 mt-1">Sent: {new Date(tracking.sentAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        {getStatusBadge(tracking.status)}
                                        {['sent', 'ghosted', 'follow-up', 'Engaged', 'responded'].includes(tracking.status) && (
                                            <button 
                                                onClick={() => handleSetStatus(tracking._id, 'not-interested')}
                                                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md hover:bg-gray-300"
                                                title="Mark as Not Interested"
                                            >
                                                &#10005; {/* A simple 'X' icon */}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 p-8">
                        <h3 className="text-lg font-semibold text-gray-700">No emails are being tracked.</h3>
                        <p>Emails you send from the "Drafts" page will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackingsPage;