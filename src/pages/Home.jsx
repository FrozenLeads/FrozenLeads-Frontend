import React, { useState } from 'react';
import GmailConnect from '../components/GmailConnect';
import TrackEmail from '../components/TrackEmail';
import TrackingStatus from '../components/TrackingStatus';
import { Outlet } from 'react-router-dom';

const Home = () => {
  const [trackingId, setTrackingId] = useState('');

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to Email Tracker</h1>
      <GmailConnect />
      <TrackEmail setTrackingId={setTrackingId} />
      <TrackingStatus trackingId={trackingId} />
      <Outlet />
    </div>
  );
};

export default Home;
