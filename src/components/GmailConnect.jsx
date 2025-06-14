import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Base_URL } from '../Api/Base';
import { loginSuccess } from '../redux/authSlice';

function GmailConnect() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const isGmailConnected = user?.googleTokens;

  const [loading, setLoading] = useState(false);

  const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  async function generatePKCECodes() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let verifier = '';
    const array = new Uint8Array(64);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
      verifier += chars[array[i] % chars.length];
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return { code_verifier: verifier, code_challenge: challenge };
  }

  const handleConnect = async () => {
    try {
      setLoading(true);
      const { code_verifier, code_challenge } = await generatePKCECodes();
      sessionStorage.setItem('pkce_code_verifier', code_verifier);
      console.log('JWT Token:', token); // frontend


      const response = await axios.get(Base_URL+'/auth', {
        params: {
          code_challenge,
          scope: SCOPES.join(' ')
        },
      
        withCredentials: true
      });

      window.location.href = response.data.authUrl;
    } catch (err) {
      console.error('Connection error:', err);
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${Base_URL}/disconnect-gmail`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      dispatch(loginSuccess({
        user: response.data.user,
        token
      }));
    } catch (err) {
      console.error('Disconnect error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReconnect = async () => {
    try {
      await handleDisconnect();
      await handleConnect();
    } catch (err) {
      console.error('Reconnect error:', err);
    }
  };

  return (
    <div className="mt-4">
      {loading ? (
        <button className="bg-gray-400 text-white px-4 py-2 rounded" disabled>
          Processing...
        </button>
      ) : isGmailConnected ? (
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
            Gmail Connected ✅
          </button>
          <button
            onClick={handleReconnect}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Reconnect
          </button>
          <button
            onClick={handleDisconnect}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Connect Gmail
        </button>
      )}
    </div>
  );
}

export default GmailConnect;
