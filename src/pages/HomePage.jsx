import React from 'react';
import { useAuth } from '../context/AuthContext';
import GmailConnect from '../components/tracking/GmailConnect';
import TrackEmail from '../components/tracking/TrackEmail';

const HomePage = () => {
    const { user } = useAuth();
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.firstName}!</h1>
            <p className="text-gray-600 mb-8">This is your dashboard. Manage your leads, track emails, and collaborate with your team.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-3">Connect Your Gmail</h2>
                    <GmailConnect />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-3">Track a New Email</h2>
                    <TrackEmail />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
