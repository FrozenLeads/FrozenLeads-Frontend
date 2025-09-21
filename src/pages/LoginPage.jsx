import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const LoginPage = () => {
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
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Welcome Back</h2>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
                    <input name="emailId" type="email" placeholder="Email" value={formData.emailId} onChange={handleChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" required />
                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" required />
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300">{loading ? 'Logging in...' : 'Login'}</button>
                </form>
                 <p className="text-center text-sm text-gray-600 mt-4">
                    Don’t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
