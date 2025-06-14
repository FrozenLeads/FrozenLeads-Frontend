import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function TrackingStatus({ trackingId }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth); // get token from Redux

  useEffect(() => {
    if (!trackingId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/tracking/${trackingId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch status`);
        }

        const data = await response.json();
        setStatus(data);
      } catch (err) {
        console.error('Status fetch error:', err);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [trackingId, token]);

  if (!trackingId) return null;
  if (loading) return <div>Loading status...</div>;
  if (!status) return <div>Status not available</div>;

  const statusColors = {
    sent: 'text-blue-600',
    delivered: 'text-indigo-600',
    opened: 'text-green-600',
    replied: 'text-green-600',
    ghosted: 'text-red-600',
    bounced: 'text-red-600',
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h4 className="text-lg font-semibold mb-2">Tracking Status</h4>
      <p className={statusColors[status.status] || 'text-gray-600'}>
        <strong>Status:</strong> {status.status?.toUpperCase() ?? 'UNKNOWN'}
      </p>
      <p><strong>To:</strong> {status.to}</p>
      <p><strong>Subject:</strong> {status.subject}</p>
      <p><strong>Sent At:</strong> {new Date(status.sentAt).toLocaleString()}</p>
      {status.respondedAt && (
        <p><strong>Replied At:</strong> {new Date(status.respondedAt).toLocaleString()}</p>
      )}
    </div>
  );
}

export default TrackingStatus;
