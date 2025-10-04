import React from 'react';
import axios from 'axios';
import { Base_URL } from '../Api/Base';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import styled, { createGlobalStyle } from 'styled-components';

// --- Global Styles (Should be at the root of your app for font consistency) ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #F4F1EC; /* Assuming the same off-white background */
  }
`;

// --- Styled Components for the Menu ---

const MenuContainer = styled.div`
  width: 220px;
  background-color: #FDFCF9; /* A slightly brighter white for the menu card */
  border-radius: 12px;
  border: 1px solid #E0DBCF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px; /* A small gap between items */
  font-family: 'Poppins', sans-serif;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.95rem;
  color: #3D3D3D;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: rgba(44, 44, 44, 0.05);
  }

  /* Style for the Link component to match the button */
  &.link-item {
    text-decoration: none;
  }

  /* Destructive action styling */
  &.logout-item:hover {
    background-color: rgba(255, 0, 0, 0.05);
    color: #D8000C;
  }
`;

const MenuSeparator = styled.hr`
  border: none;
  border-top: 1px solid #E0DBCF;
  margin: 4px 0;
`;

// --- SVG Icons ---
const TrackingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);


// --- Logout Component ---
const Logout = () => {
    // --- Original logic is preserved ---
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axios.post(`${Base_URL}/logout`, null, { withCredentials: true });
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error); // It's good practice to log errors
        }
    };

    return (
        <>
            {/* GlobalStyle should be at the root of your app, but is here for demonstration */}
            <GlobalStyle /> 
            <MenuContainer>
                <MenuItem as={Link} to='/trackings' className="link-item">
                    <TrackingIcon />
                    <span>All Trackings</span>
                </MenuItem>
                
                <MenuSeparator />

                <MenuItem onClick={handleLogout} className="logout-item">
                    <LogoutIcon />
                    <span>Logout</span>
                </MenuItem>
            </MenuContainer>
        </>
    );
};

export default Logout;