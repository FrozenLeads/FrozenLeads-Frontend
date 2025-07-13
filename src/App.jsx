import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, setAuthLoading } from './redux/authSlice';
import axios from 'axios';
import { Base_URL } from './Api/Base';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Callback from './components/Callback';
import AllTrackedEmails from './components/AllTrackedEmails.jsx';

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setAuthLoading(true));
        const res = await axios.get(`${Base_URL}/me`, {
          withCredentials: true,
        });

        dispatch(loginSuccess({
          user: res.data,
          token: res.data.token || null,
        }));
      } catch (err) {
        console.log('Auth check failed:', err.message);
        dispatch(setAuthLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center mt-12 text-lg font-semibold">Loading app...</div>;
  }

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
        path="/trackings"
        element={
          <ProtectedRoute>
            <AllTrackedEmails />
          </ProtectedRoute>
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
      <Route path="/callback" element={<Callback />} />
    </Routes>
  );
}

export default App;
