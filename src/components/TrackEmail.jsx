import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TrackingStatus from './TrackingStatus';

function TrackEmail() {
  const [to, setTo] = useState('ashar050488@gmail.com');
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');
  const { user, token } = useSelector((state) => state.auth);
  const [loading,setLoading] = useState(false);

  const handleTrack = async () => {
    if (!to) {
      setError('Recipient email is required');
      return;
    }
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:5000/track',
        { to },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );

      setTrackingId(response.data.trackingId);
      setError('');
    } catch (error) {
      if (error.response?.status === 403) {
        setError(
          <span>
            Permission error: Please reconnect your Gmail with updated permissions. 
            <a href="#gmail-connect" className="underline ml-1">Go to settings</a>
          </span>
        );
      } else if (error.response) {
        setError(error.response.data?.error || 'Failed to start tracking');
      } else {
        setError('Network error');
      }
      setTrackingId('');
      
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded mt-4 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Track an Email</h3>

      <input
        type="email"
        placeholder="Recipient Email"
        className="border p-2 mb-3 w-full"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <button
        onClick={handleTrack}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
        {loading?'Tracking .... ':'Start Tracking'}
      </button>
      {trackingId && (
        <div className="mt-4">
          <TrackingStatus trackingId={trackingId} />
        </div>
      )}
    </div>
  );
}

export default TrackEmail;