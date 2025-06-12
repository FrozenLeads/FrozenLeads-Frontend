import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Base_URL } from '../Api/Base';

function GmailConnect() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const isGmailConnected = user?.googleTokens;

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
      const { code_verifier, code_challenge } = await generatePKCECodes();
      sessionStorage.setItem('pkce_code_verifier', code_verifier);

      const response = await axios.get(`${Base_URL}/auth`, {
        params: { code_challenge },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      window.location.href = response.data.authUrl;
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  return (
    <button
      onClick={isGmailConnected ? null : handleConnect}
      className={`px-4 py-2 rounded mt-4 ${
        isGmailConnected ? 'bg-green-600 cursor-not-allowed' : 'bg-blue-600'
      } text-white`}
      disabled={isGmailConnected}
    >
      {isGmailConnected ? 'Gmail Connected ✅' : 'Connect Gmail'}
    </button>
  );
}

export default GmailConnect;
