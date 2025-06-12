import React, { useState, useEffect } from 'react';

function TrackingStatus({ trackingId }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackingId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/tracking/${trackingId}`);
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        console.error('Status fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [trackingId]);

  if (!trackingId) return null;
  if (loading) return <div>Loading status...</div>;
  if (!status) return <div>Status not found</div>;

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
        <strong>Status:</strong> {status.status.toUpperCase()}
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
