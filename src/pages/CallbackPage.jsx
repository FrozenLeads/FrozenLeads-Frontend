import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- Global Styles & Fonts (Consistent with the theme) ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #F4F1EC;
    color: #2C2C2C;
  }
`;

// --- Keyframe Animations ---
const slowDrift = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 30px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// --- Styled Components for the Loading Page ---
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 20px;
`;

const GradientBlob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  z-index: 0;
  pointer-events: none;
  animation: ${slowDrift} 30s ease-in-out infinite alternate;
`;

const Blob1 = styled(GradientBlob)`
  width: 500px;
  height: 500px;
  top: 0;
  left: 0;
  transform: translate(-30%, -30%);
  background: radial-gradient(circle, #FFDDA1, #F0C38E);
`;

const Blob2 = styled(GradientBlob)`
  width: 400px;
  height: 400px;
  bottom: 0;
  right: 0;
  transform: translate(30%, 30%);
  background: radial-gradient(circle, #C2DFFF, #D8B5FF);
  animation-delay: -10s;
`;

const LoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(44, 44, 44, 0.1);
  border-left-color: #2C2C2C;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2C2C2C;
`;

const SubText = styled.p`
  font-size: 1rem;
  color: #555;
`;

// --- CallbackPage Component ---
const CallbackPage = () => {
    // --- All original logic is preserved ---
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const exchangeCode = async () => {
            const code = new URLSearchParams(window.location.search).get('code');
            const code_verifier = sessionStorage.getItem('pkce_code_verifier');
            if (code && code_verifier) {
                try {
                    await api.post('/callback', { code, code_verifier });
                    // Refetch user state as tokens are stored on the user object in the DB.
                    const meRes = await api.get('/me');
                    const localToken = localStorage.getItem('token');
                    login(meRes.data, localToken); // Re-login with updated user data
                    navigate('/');
                } catch (err) {
                    console.error('Token exchange failed:', err);
                    navigate('/'); // Go home on error
                } finally {
                    sessionStorage.removeItem('pkce_code_verifier');
                }
            } else {
                // If no code is present, just go home.
                navigate('/');
            }
        };
        exchangeCode();
    }, [navigate, login]);

    // --- Redesigned JSX ---
    return (
        <>
            <GlobalStyle />
            <PageContainer>
                <Blob1 />
                <Blob2 />
                <LoadingBox>
                    <Spinner />
                    <LoadingText>Connecting to Gmail</LoadingText>
                    <SubText>Please wait, you will be redirected shortly...</SubText>
                </LoadingBox>
            </PageContainer>
        </>
    );
};

export default CallbackPage;