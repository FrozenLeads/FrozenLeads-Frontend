import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- Global Styles & Fonts (Same as before for consistency) ---
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

// --- Keyframe Animations (Same as before) ---
const slowDrift = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -30px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components (Mostly reused, with additions for select) ---

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
  filter: blur(80px);
  opacity: 0.6;
  z-index: 0;
  pointer-events: none;
  animation: ${slowDrift} 25s ease-in-out infinite alternate;
`;

const Blob1 = styled(GradientBlob)`
  width: 400px;
  height: 400px;
  top: -10%;
  right: -15%; /* Switched side for variety */
  background: radial-gradient(circle, #C2DFFF, #D8B5FF);
`;

const Blob2 = styled(GradientBlob)`
  width: 300px;
  height: 300px;
  bottom: -5%;
  left: -10%; /* Switched side for variety */
  background: radial-gradient(circle, #FFDDA1, #F0C38E);
  animation-delay: -8s;
`;

const SignupFormContainer = styled.div`
  max-width: 420px; /* Slightly wider for more fields */
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
  transform: translate(-50%, -50%) rotate(3deg);
  width: 140%;
  height: 140%;
  z-index: -1;
  opacity: 0.9;
  
  path {
    stroke: #FFA500;
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

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two columns for age/gender */
  gap: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 35px;
  text-align: left;
  grid-column: span 2; /* Default to full width */

  &.half-width {
    grid-column: span 1; /* For side-by-side fields */
  }
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

const StyledSelect = styled.select`
  width: 100%;
  border: none;
  border-bottom: 1px solid #C4C4C4;
  background: transparent;
  padding: 10px 5px;
  font-size: 1rem;
  color: #2C2C2C;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.3s ease;
  appearance: none; /* Hides default dropdown arrow */
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232C2C2C%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-13%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2013l128%20127.9c3.6%203.6%207.8%205.4%2013%205.4s9.4-1.8%2013-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-13%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 5px top 50%;
  background-size: .65em auto;
  
  &:focus {
    outline: none;
    border-color: #2C2C2C;
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
  margin-top: 10px; /* Space above the button */
  margin-bottom: 15px;
  transition: transform 0.2s ease, background-color 0.2s ease;
  
  &:hover { transform: translateY(-2px); }
  &:active { transform: translateY(0); }
  &:disabled { background-color: #888; cursor: not-allowed; }
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

  &:hover { background-color: rgba(44, 44, 44, 0.05); }
`;

// --- SignupPage Component ---
const SignupPage = () => {
    // --- Updated logic with new fields ---
    const navigate = useNavigate();
    const [form, setForm] = useState({ 
        firstName: '', 
        emailId: '', 
        password: '', 
        age: '', 
        gender: '' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/signup', form);
            navigate('/login'); // Redirect to login after successful signup
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Signup failed. Please try again.');
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
                <SignupFormContainer>
                    <TitleWrapper>
                        <Title>Create Account</Title>
                        <ScribbleSvg viewBox="0 0 250 100">
                            <path d="M10 50 C 40 10, 210 10, 240 50 S 210 90, 10 90" />
                        </ScribbleSvg>
                    </TitleWrapper>
                    
                    <form onSubmit={handleSubmit}>
                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <InputGroup>
                            <StyledInput name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
                        </InputGroup>
                        <InputGroup>
                            <StyledInput name="emailId" type="email" placeholder="Email Address" value={form.emailId} onChange={handleChange} required />
                        </InputGroup>
                        <InputGroup>
                            <StyledInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                        </InputGroup>
                        
                        <InputGrid>
                            <InputGroup className="half-width">
                                <StyledInput name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
                            </InputGroup>
                            <InputGroup className="half-width">
                                <StyledSelect name="gender" value={form.gender} onChange={handleChange} required>
                                    <option value="" disabled>Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </StyledSelect>
                            </InputGroup>
                        </InputGrid>
                        
                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Sign Up'}
                        </PrimaryButton>
                    </form>
                    <SecondaryLink to="/login">
                        Already have an account?
                    </SecondaryLink>
                </SignupFormContainer>
            </PageContainer>
        </>
    );
};

export default SignupPage;