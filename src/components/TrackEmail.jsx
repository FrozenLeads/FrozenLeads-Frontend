import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function TrackEmail() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');
  const user = useSelector((state) => state.user.user);

  const handleTrack = async () => {
    if (!to || !subject) {
      setError('Recipient and subject are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ to, subject, body }),
      });

      const data = await response.json();
      if (response.ok) {
        setTrackingId(data.trackingId);
        setError('');
      } else {
        setError(data.error || 'Failed to start tracking');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded mt-4">
      <h3 className="text-xl font-semibold mb-4">Track an Email</h3>

      <input
        type="email"
        placeholder="Recipient Email"
        className="border p-2 mb-2 w-full"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        className="border p-2 mb-2 w-full"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Body (Optional)"
        className="border p-2 mb-2 w-full"
        rows="4"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleTrack}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Track Email
      </button>

      {trackingId && (
        <div className="mt-3 text-green-600">
          Tracking started! ID: {trackingId}
        </div>
      )}
    </div>
  );
}

export default TrackEmail;
