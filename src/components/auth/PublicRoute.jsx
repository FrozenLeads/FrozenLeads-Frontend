import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/" /> : children;
};

export default PublicRoute;
