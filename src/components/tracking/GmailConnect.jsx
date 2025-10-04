import React from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

// --- Styled Components for GmailConnect ---

const Wrapper = styled.div`
  font-family: 'Poppins', sans-serif;
  color: #2C2C2C;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2C2C2C;
  color: #F4F1EC;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// --- Components for the "Connected" state ---

const ConnectedStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: rgba(34, 139, 34, 0.08); /* Soft green */
  border: 1px solid rgba(34, 139, 34, 0.15);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #228B22; /* Forest Green */

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #228B22;
  }
`;

const DisconnectButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;

  &:hover {
    color: #D8000C; /* Red for destructive action on hover */
  }
`;


// --- GmailConnect Component ---

const GmailConnect = () => {
    // --- All original logic is preserved ---
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

    // --- Redesigned JSX ---
    if (isGmailConnected) {
        return (
            <ConnectedStateWrapper>
                <StatusIndicator>
                    Gmail Connected
                </StatusIndicator>
                <DisconnectButton onClick={handleDisconnect}>
                    Disconnect
                </DisconnectButton>
            </ConnectedStateWrapper>
        );
    }

    return (
        <Wrapper>
            <Description>
                Connect your account to automatically track email opens, replies, and manage leads seamlessly.
            </Description>
            <PrimaryButton onClick={handleConnect}>
                Connect Gmail
            </PrimaryButton>
        </Wrapper>
    );
};

export default GmailConnect;