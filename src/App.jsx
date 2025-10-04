import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CallbackPage from './pages/CallbackPage.jsx';
import TrackingsPage from './pages/TrackingsPage.jsx';
import LeadsPage from './pages/LeadsPage.jsx';
import GroupsPage from './pages/GroupsPage.jsx';
import GroupDetailsPage from './pages/GroupDetailsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import PublicRoute from './components/auth/PublicRoute.jsx';
import Navbar from './components/common/Navbar.jsx';
import DraftsPage from './pages/DraftsPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="">
          <Routes>
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/trackings" element={<ProtectedRoute><TrackingsPage /></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
            <Route path="/groups/:groupId" element={<ProtectedRoute><GroupDetailsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/drafts" element={<ProtectedRoute><DraftsPage /></ProtectedRoute>} />

            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;

