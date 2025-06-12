import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '../redux/authSlice';
import { Base_URL } from '../Api/Base';

const Callback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const exchangeCode = async () => {
      const code = new URLSearchParams(location.search).get('code');
      const code_verifier = sessionStorage.getItem('pkce_code_verifier');

      if (!code || !code_verifier) {
        console.error('Missing code or PKCE verifier.');
        navigate('/error');
        return;
      }

      try {
        const res = await axios.post(`${Base_URL}/callback`, {
          code,
          code_verifier  // Send as code_verifier
        }, {
          withCredentials: true,
        });

        // Dispatch user data to Redux
        dispatch(loginSuccess({ 
          user: res.data.user, 
          token: res.data.token 
        }));
        
        navigate('/');
      } catch (err) {
        console.error('Token exchange failed:', err.response?.data || err.message);
        navigate('/error', { state: { error: err.response?.data } });
      } finally {
        sessionStorage.removeItem('pkce_code_verifier');
      }
    };

    exchangeCode();
  }, [location, navigate, dispatch]);

  return <p>Connecting Gmail, please wait...</p>;
};

export default Callback;