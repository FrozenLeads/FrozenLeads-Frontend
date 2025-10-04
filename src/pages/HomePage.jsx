import React from 'react';
import { useAuth } from '../context/AuthContext';
import GmailConnect from '../components/tracking/GmailConnect';
import TrackEmail from '../components/tracking/TrackEmail';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- Global Styles & Fonts (Consistent with the theme) ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap');

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

// --- Keyframe Animations (Consistent with the theme) ---
const slowDrift = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 30px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components for the Dashboard ---

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 60px 40px;
  }
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

const Header = styled.header`
  max-width: 800px;
  margin: 0 auto 50px auto;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const WelcomeHeading = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ActionCard = styled.div`
  background-color: #FDFCF9;
  border: 1px solid #E0DBCF;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out forwards;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2C2C2C;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: #F4F1EC;
  
  svg {
    width: 24px;
    height: 24px;
    stroke: #555;
  }
`;

// --- SVG Icons ---
const GmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const TrackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path><path d="M21 21l-4.35-4.35"></path><path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
    </svg>
);


// --- HomePage Component ---
const HomePage = () => {
    const { user } = useAuth();

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Blob1 />
                <Blob2 />
                <Header>
                    <WelcomeHeading>
                        Welcome, {user?.firstName}!
                    </WelcomeHeading>
                    <PageSubtitle>
                        This is your dashboard. Connect your accounts, track your emails, and see all your progress in one place.
                    </PageSubtitle>
                </Header>
                <CardGrid>
                    <ActionCard style={{animationDelay: '0.2s'}}>
                        <CardHeader>
                            <CardIcon><GmailIcon /></CardIcon>
                            <CardTitle>Connect Your Gmail</CardTitle>
                        </CardHeader>
                        {/* Your GmailConnect component will render here */}
                        <GmailConnect />
                    </ActionCard>
                    <ActionCard style={{animationDelay: '0.4s'}}>
                        <CardHeader>
                            <CardIcon><TrackIcon /></CardIcon>
                            <CardTitle>Track a New Email</CardTitle>
                        </CardHeader>
                        {/* Your TrackEmail component will render here */}
                        <TrackEmail />
                    </ActionCard>
                </CardGrid>
            </PageWrapper>
        </>
    );
};

export default HomePage;