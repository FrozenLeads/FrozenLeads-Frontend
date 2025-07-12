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
import Callback from './components/Callback';

function App() {
  const dispatch = useDispatch();

// App.js
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${Base_URL}/me`, {
        withCredentials: true,
      });

      // FIX: Pass token if available
      dispatch(loginSuccess({ 
        user: res.data, 
        token: res.data.token || null 
      }));
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
      <Route path="/callback" element={<Callback />} />
    </Routes>
  );
}

export default App;
// import React from 'react'
// import LoginPage from './pages/LoginPage'
// import SignupPage from './pages/Signup'
// import ProfilePage from './pages/ProfilePage'
// import Profile from './pages/Profile'

// const App = () => {
//   return (
//     <div>
//       {/* <LoginPage/> */}
//       <SignupPage/>
//       {/* <ProfilePage/> */}
//       {/* <Profile/> */}
//     </div>
//   )
// }

// export default App