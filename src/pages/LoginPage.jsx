import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- Global Styles & Fonts ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
    background-color: #F4F1EC; /* Off-white, paper-like background */
  }
`;

// --- Keyframe Animations ---
const slowDrift = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -30px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---

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
  filter: blur(80px); /* Creates the soft, out-of-focus look */
  opacity: 0.6;
  z-index: 0;
  pointer-events: none;
  animation: ${slowDrift} 25s ease-in-out infinite alternate;
`;

const Blob1 = styled(GradientBlob)`
  width: 400px;
  height: 400px;
  top: -10%;
  left: -15%;
  background: radial-gradient(circle, #FFDDA1, #F0C38E); /* Warm orange/yellow */
`;

const Blob2 = styled(GradientBlob)`
  width: 300px;
  height: 300px;
  bottom: -5%;
  right: -10%;
  background: radial-gradient(circle, #C2DFFF, #D8B5FF); /* Cool purple/blue */
  animation-delay: -8s; /* Stagger the animation */
`;

const LoginFormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 40px;
  position: relative;
  z-index: 1;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const TitleWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 50px;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  color: #2C2C2C;
`;

const ScribbleSvg = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-5deg);
  width: 140%;
  height: 140%;
  z-index: -1;
  opacity: 0.9;
  
  path {
    stroke: #FFA500; /* Orange scribble color */
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const ErrorMessage = styled.p`
  background-color: rgba(255, 0, 0, 0.05);
  color: #D8000C;
  border: 1px solid rgba(255, 0, 0, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const InputGroup = styled.div`
  margin-bottom: 35px;
  text-align: left;
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

  &::placeholder {
    color: #888;
    font-weight: 300;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #2C2C2C;
  color: #F4F1EC;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 15px;
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

const SecondaryLink = styled(Link)`
  display: inline-block;
  width: 100%;
  padding: 15px;
  background-color: transparent;
  color: #2C2C2C;
  border: 1px solid #2C2C2C;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: rgba(44, 44, 44, 0.05);
  }
`;


// --- LoginPage Component ---
const LoginPage = () => {
    // --- All original logic is preserved ---
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ emailId: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/login', formData);
            if (res.data.token && res.data.user) {
                login(res.data.user, res.data.token);
                navigate('/');
            } else {
                setError('Login failed: Invalid response from server.');
            }
        } catch (err) {
            setError(err.response?.data || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <GlobalStyle />
            <PageContainer>
                <Blob1 />
                <Blob2 />
                <LoginFormContainer>
                    <TitleWrapper>
                        <Title>Welcome Back</Title>
                        <ScribbleSvg viewBox="0 0 200 100">
                          <path d="M10 50 Q 50 10, 100 50 T 190 50" />
                        </ScribbleSvg>
                    </TitleWrapper>
                    
                    <form onSubmit={handleLogin}>
                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <InputGroup>
                            <StyledInput 
                                name="emailId" 
                                type="email" 
                                placeholder="Email address" 
                                value={formData.emailId} 
                                onChange={handleChange} 
                                required 
                            />
                        </InputGroup>
                        <InputGroup>
                            <StyledInput 
                                name="password" 
                                type="password" 
                                placeholder="Password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </InputGroup>

                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </PrimaryButton>
                    </form>
                    <SecondaryLink to="/signup">
                        Don’t have an account?
                    </SecondaryLink>
                </LoginFormContainer>
            </PageContainer>
        </>
    );
};

export default LoginPage;