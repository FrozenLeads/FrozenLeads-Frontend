import React from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const GmailConnect = () => {
    const { user, updateUser } = useAuth();
    const isGmailConnected = user?.googleTokens;

    async function generatePKCECodes() {
        const verifier = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
        const data = new TextEncoder().encode(verifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return { code_verifier: verifier, code_challenge: challenge };
    }

    const handleConnect = async () => {
        try {
            const { code_verifier, code_challenge } = await generatePKCECodes();
            sessionStorage.setItem('pkce_code_verifier', code_verifier);
            const response = await api.get('/auth', { params: { code_challenge } });
            window.location.href = response.data.authUrl;
        } catch (err) { console.error('Connection error:', err); }
    };
    
    const handleDisconnect = async () => {
        try {
            const res = await api.post('/disconnect-gmail');
            updateUser(res.data.user);
        } catch (err) { console.error('Disconnect error:', err); }
    };

    if (isGmailConnected) {
        return (
             <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">Gmail Connected</span>
                <button onClick={handleDisconnect} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-md hover:bg-red-200">Disconnect</button>
            </div>
        );
    }
    return <button onClick={handleConnect} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Connect Gmail</button>;
};

export default GmailConnect;
