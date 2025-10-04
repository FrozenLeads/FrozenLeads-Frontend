import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- Global Styles (Should be at the root of your app) ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #F4F1EC;
  }
`;

// --- Keyframe Animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slowDrift = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -30px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
`;

// --- Styled Components for the Navbar ---

const NavContainer = styled.nav`
  background-color: #FDFCF9;
  border-bottom: 1px solid #E0DBCF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 0 40px;
  }
`;

const NavContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(NavLink)`
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2C2C2C;
  text-decoration: none;
`;

const NavLinksContainer = styled.div`
  display: none; /* Hidden on mobile */
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 15px;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #555;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background-color: #2C2C2C;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #2C2C2C;
  }
  
  &.active {
    color: #2C2C2C;
    font-weight: 500;
  }

  &.active::after {
    width: 60%;
  }
`;

const LogoutButton = styled.button`
  display: none; /* Hidden on mobile */

  @media (min-width: 768px) {
    display: inline-block;
    padding: 10px 20px;
    background-color: transparent;
    color: #2C2C2C;
    border: 1px solid #2C2C2C;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
      background-color: #2C2C2C;
      color: #FDFCF9;
    }
  }
`;

// --- Mobile Menu Components ---

const MobileMenuIcon = styled.button`
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #F4F1EC;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;
`;

const MobileNavLink = styled(NavLink)`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: #2C2C2C;
  text-decoration: none;

  &.active {
    text-decoration: underline;
    text-decoration-color: #FFA500;
  }
`;

const GradientBlob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  z-index: -1;
  animation: ${slowDrift} 25s ease-in-out infinite alternate;
`;

const Blob1 = styled(GradientBlob)`
  width: 400px; height: 400px; top: -10%; left: -15%;
  background: radial-gradient(circle, #FFDDA1, #F0C38E);
`;

const Blob2 = styled(GradientBlob)`
  width: 300px; height: 300px; bottom: -5%; right: -10%;
  background: radial-gradient(circle, #C2DFFF, #D8B5FF);
`;


// --- Navbar Component ---
const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <GlobalStyle />
            <NavContainer>
                <NavContent>
                    <Logo to="/" onClick={closeMenu}>FrozenLeads</Logo>
                    
                    <NavLinksContainer>
                        <StyledNavLink to="/trackings">Trackings</StyledNavLink>
                        {/* --- NEW DRAFTS LINK ADDED HERE --- */}
                        <StyledNavLink to="/drafts">Drafts</StyledNavLink>
                        <StyledNavLink to="/leads">Leads</StyledNavLink>
                        <StyledNavLink to="/groups">Groups</StyledNavLink>
                        <StyledNavLink to="/profile">Profile</StyledNavLink>
                    </NavLinksContainer>
                    
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>

                    <MobileMenuIcon onClick={() => setMenuOpen(!menuOpen)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d={menuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </MobileMenuIcon>
                </NavContent>
            </NavContainer>

            {menuOpen && (
                <MobileMenuOverlay>
                    <Blob1 />
                    <Blob2 />
                    <MobileNavLink to="/" onClick={closeMenu}>Home</MobileNavLink>
                    <MobileNavLink to="/trackings" onClick={closeMenu}>Trackings</MobileNavLink>
                    {/* --- NEW DRAFTS LINK ADDED HERE --- */}
                    <MobileNavLink to="/drafts" onClick={closeMenu}>Drafts</MobileNavLink>
                    <MobileNavLink to="/leads" onClick={closeMenu}>Leads</MobileNavLink>
                    <MobileNavLink to="/groups" onClick={closeMenu}>Groups</MobileNavLink>
                    <MobileNavLink to="/profile" onClick={closeMenu}>Profile</MobileNavLink>
                    <LogoutButton style={{ display: 'inline-block', marginTop: '20px' }} onClick={() => { handleLogout(); closeMenu(); }}>
                        Logout
                    </LogoutButton>
                </MobileMenuOverlay>
            )}
        </>
    );
};

export default Navbar;