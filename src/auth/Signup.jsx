import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// This is a placeholder. You should import your actual Base_URL.
const Base_URL = 'http://localhost:3000'; 

// --- Global Styles & Fonts (Same as LoginPage) ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden; /* Allow vertical scroll for longer forms */
    background-color: #F4F1EC; 
  }
`;

// --- Keyframe Animations (Same as LoginPage) ---
const slowDrift = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -30px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components (Reused & New) ---

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 40px 20px; /* More padding for a longer form */
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
  left: -15%;
  background: radial-gradient(circle, #FFDDA1, #F0C38E);
`;

const Blob2 = styled(GradientBlob)`
  width: 300px;
  height: 300px;
  bottom: -5%;
  right: -10%;
  background: radial-gradient(circle, #C2DFFF, #D8B5FF);
  animation-delay: -8s;
`;

const SignupFormContainer = styled.div`
  max-width: 600px; /* Wider for two-column layout */
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
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 20px;
  
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
  text-align: left;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 25px;
`;

const InputGroup = styled.div`
  text-align: left;
  margin-bottom: 25px; /* Spacing for single-column inputs */
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
  cursor: pointer;

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
  margin-top: 20px; /* Margin above the button */
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
  display: block;
  width: 100%;
  padding: 15px;
  background-color: transparent;
  color: #2C2C2C;
  border: none;
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;

// --- Signup Component ---

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    age: '',
    gender: '',
    photoUrl: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(Base_URL + '/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        navigate('/login');
      } else {
        const errorText = await res.text();
        setError(errorText || 'An unknown error occurred.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
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
            <ScribbleSvg viewBox="0 0 100 10">
              <path d="M 0 5 Q 25 10, 50 5 T 100 5" />
            </ScribbleSvg>
          </TitleWrapper>
          
          <form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormGrid>
              <InputGroup>
                <StyledInput name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
              </InputGroup>
              <InputGroup>
                <StyledInput name="lastName" type="text" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
              </InputGroup>
            </FormGrid>

            <InputGroup>
              <StyledInput name="emailId" type="email" placeholder="Email Address" value={form.emailId} onChange={handleChange} required />
            </InputGroup>

            <InputGroup>
              <StyledInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            </InputGroup>
            
            <FormGrid>
              <InputGroup>
                  <StyledInput name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
              </InputGroup>
              <InputGroup>
                <StyledSelect name="gender" value={form.gender} onChange={handleChange}>
                    <option value="" disabled>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </StyledSelect>
              </InputGroup>
            </FormGrid>
            
            <InputGroup>
              <StyledInput name="photoUrl" type="text" placeholder="Photo URL (optional)" value={form.photoUrl} onChange={handleChange} />
            </InputGroup>

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </PrimaryButton>
          </form>
          
          <SecondaryLink to="/login">
            Already have an account? Sign In
          </SecondaryLink>
        </SignupFormContainer>
      </PageContainer>
    </>
  );
};

export default Signup;