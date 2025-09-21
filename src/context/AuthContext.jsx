import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const res = await api.get('/me');
                    setUser(res.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Session expired or invalid.", error);
                    localStorage.removeItem('token'); // Clear invalid token
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Logout API call failed, logging out client-side.", error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (updatedUserData) => {
        setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
    };

    const value = { user, isAuthenticated, loading, login, logout, updateUser };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
