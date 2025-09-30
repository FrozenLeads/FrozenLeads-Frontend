import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const SignupPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: '', emailId: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/signup', form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
         <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Create an Account</h2>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
                    <input name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" required />
                    <input name="emailId" type="email" placeholder="Email" value={form.emailId} onChange={handleChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" required />
                    <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" required />
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300">{loading ? 'Creating...' : 'Sign Up'}</button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
