import React, { useState } from 'react';
import api from '../../api/api';
import styled, { keyframes } from 'styled-components';

// --- Keyframe Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components for TrackEmail ---
const StyledForm = styled.form`
  font-family: 'Poppins', sans-serif;
  color: #2C2C2C;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 25px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #C4C4C4;
  background: transparent;
  padding: 10px 5px;
  font-size: 1rem;
  color: #2C2C2C;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2C2C2C;
  }
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

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
`;

const FeedbackMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  animation: ${fadeIn} 0.3s ease-out;
  
  /* Conditional styling based on isError prop */
  color: ${props => (props.isError ? '#D8000C' : '#228B22')};
  background-color: ${props => (props.isError ? 'rgba(255, 0, 0, 0.05)' : 'rgba(34, 139, 34, 0.08)')};
  border: 1px solid ${props => (props.isError ? 'rgba(255, 0, 0, 0.1)' : 'rgba(34, 139, 34, 0.15)')};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

// --- SVG Icons for Feedback ---
const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- TrackEmail Component ---
const TrackEmail = () => {
    // --- All original logic is preserved ---
    const [to, setTo] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!to) return;
        setLoading(true);
        setMessage('');
        try {
            const response = await api.post('/track', { to });
            setMessage(`Success! Tracking started for email to ${to}.`);
            setIsError(false);
            setTo('');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to start tracking');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    // --- Redesigned JSX ---
    return (
        <StyledForm onSubmit={handleTrack}>
            <Description>
                Enter a recipient's email address below to generate a unique tracking link for your outreach.
            </Description>
            <InputGroup>
                <StyledInput 
                    type="email" 
                    placeholder="recipient@example.com" 
                    value={to} 
                    onChange={(e) => setTo(e.target.value)} 
                    required 
                />
            </InputGroup>
            <PrimaryButton type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Start Tracking'}
            </PrimaryButton>
            {message && (
                <FeedbackMessage isError={isError}>
                    {isError ? <ErrorIcon /> : <SuccessIcon />}
                    <span>{message}</span>
                </FeedbackMessage>
            )}
        </StyledForm>
    );
};

export default TrackEmail;