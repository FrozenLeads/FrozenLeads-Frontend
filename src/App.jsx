import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/authSlice';
import axios from 'axios';
import { Base_URL } from './Api/Base';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Callback from './components/Callback'; // 👈 add this import

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${Base_URL}/me`, {
          withCredentials: true,
        });
        dispatch(loginSuccess({ user: res.data }));
      } catch (err) {
        console.log('Auth check failed:', err.message);
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      {/* 👇 Gmail OAuth Callback Route */}
      <Route path="/callback" element={<Callback />} />
    </Routes>
  );
}

export default App;
