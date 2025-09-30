import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    const linkClass = "text-gray-700 hover:bg-gray-200 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors";
    const activeLinkClass = "bg-blue-100 text-blue-700";

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <NavLink to="/" className="flex-shrink-0">
                       <span className="font-bold text-2xl text-blue-700">FrozenLeads</span>
                    </NavLink>
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink to="/trackings" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Trackings</NavLink>
                        <NavLink to="/leads" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Leads</NavLink>
                        <NavLink to="/groups" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Groups</NavLink>
                        <NavLink to="/profile" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Profile</NavLink>
                    </div>
                    <div className="flex items-center">
                         <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
