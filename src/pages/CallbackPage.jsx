import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const CallbackPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const exchangeCode = async () => {
            const code = new URLSearchParams(window.location.search).get('code');
            const code_verifier = sessionStorage.getItem('pkce_code_verifier');
            if (code && code_verifier) {
                try {
                    await api.post('/callback', { code, code_verifier });
                    // Refetch the user state as tokens are stored on the user object in the DB.
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
            }
        };
        exchangeCode();
    }, [navigate, login]);

    return <div className="text-center p-10">Connecting to Gmail, please wait...</div>;
};

export default CallbackPage;
