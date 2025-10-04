import React, { useState } from 'react';
import api from '../../api/api';
import styled, { keyframes } from 'styled-components';

// --- Keyframe Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components for the Email Composer ---

const ComposerWrapper = styled.div`
  /* This wrapper helps center the component if it's on its own page */
  display: flex;
  justify-content: center;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
`;

const ComposerCard = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #FDFCF9;
  border: 1px solid #E0DBCF;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  animation: ${fadeIn} 0.5s ease-out;
`;

const CardTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 30px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div`
  /* Wraps each input for spacing */
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

// New styled component for the textarea, matching the input style
const StyledTextarea = styled.textarea`
  width: 100%;
  border: none;
  border-bottom: 1px solid #C4C4C4;
  background: transparent;
  padding: 10px 5px;
  font-size: 1rem;
  color: #2C2C2C;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.3s ease;
  resize: vertical; /* Allows user to resize height */
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #2C2C2C;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 10px;
  background-color: #2C2C2C;
  color: #F4F1EC;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover { transform: translateY(-2px); }
  &:active { transform: translateY(0); }
  &:disabled { background-color: #888; cursor: not-allowed; }
`;

const FeedbackMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  animation: ${fadeIn} 0.3s ease-out;
  
  color: ${props => (props.isError ? '#D8000C' : '#228B22')};
  background-color: ${props => (props.isError ? 'rgba(255, 0, 0, 0.05)' : 'rgba(34, 139, 34, 0.08)')};
  border: 1px solid ${props => (props.isError ? 'rgba(255, 0, 0, 0.1)' : 'rgba(34, 139, 34, 0.15)')};

  svg { width: 20px; height: 20px; flex-shrink: 0; }
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

// --- SendEmail Component ---
const SendEmail = () => {
    // --- Logic is preserved, with the addition of 'isError' state ---
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false); // Added for better feedback styling
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await api.post('/track/send', { to, subject, body });
            setMessage(res.data.message);
            setIsError(false); // Set success state
            // Clear form on success
            setTo('');
            setSubject('');
            setBody('');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to send.');
            setIsError(true); // Set error state
        } finally {
            setLoading(false);
        }
    };

    return (
        <ComposerWrapper>
            <ComposerCard>
                <CardTitle>Send & Track a New Email</CardTitle>
                <StyledForm onSubmit={handleSend}>
                    <InputGroup>
                        <StyledInput type="email" placeholder="Recipient (To)" value={to} onChange={e => setTo(e.target.value)} required />
                    </InputGroup>
                    <InputGroup>
                        <StyledInput type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
                    </InputGroup>
                    <InputGroup>
                        <StyledTextarea placeholder="Email Body..." value={body} onChange={e => setBody(e.target.value)} rows="5" required />
                    </InputGroup>
                    
                    <PrimaryButton type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send and Track'}
                    </PrimaryButton>
                    
                    {message && (
                        <FeedbackMessage isError={isError}>
                            {isError ? <ErrorIcon /> : <SuccessIcon />}
                            <span>{message}</span>
                        </FeedbackMessage>
                    )}
                </StyledForm>
            </ComposerCard>
        </ComposerWrapper>
    );
};

export default SendEmail;