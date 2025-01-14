import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import AuthPage from './components/layouts/AuthPage'; // Import AuthPage
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import PricePopup from './components/PricePopup';

function App() {
  // Retrieve both user and member tokens from localStorage/sessionStorage
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
  const [authTokenMember, setAuthTokenMember] = useState(localStorage.getItem('authTokenMember') || sessionStorage.getItem('authTokenMember'));
  const [showPopup, setShowPopup] = useState(false);

  // Handle login success and set auth token
  const handleLoginSuccess = (token, isMember = false) => {
    if (isMember) {
      // For member login, store the token in the appropriate place
      localStorage.setItem('authTokenMember', token);  // Store member token in localStorage
      setAuthTokenMember(token);  // Update the member token state
    } else {
      // For user login, store the token in the appropriate place
      localStorage.setItem('authToken', token);  // Store user token in localStorage
      setAuthToken(token);  // Update the user token state
    }
    setShowPopup(true);  // Show the popup after successful login
  };

  // Handle logout and remove token
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenMember');  // Clear member token from localStorage
    setAuthToken(null);  // Reset the user token state
    setAuthTokenMember(null);  // Reset the member token state
  };

  useEffect(() => {
    // Optionally, check authToken and authTokenMember in useEffect if needed for redirects or other logic
  }, [authToken, authTokenMember]);

  return (
    <Router>
      <Routes>
        {/* If the user is logged in, redirect to /dashboard */}
        <Route
          path="/"
          element={authToken || authTokenMember ? <Navigate to="/dashboard" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* AuthPage handles both Login and Register toggles */}
        <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />

        {/* Route for member login */}
        <Route
          path="/member/login"
          element={<AuthPage onLoginSuccess={handleLoginSuccess} isMemberLogin={true} />}
        />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute authToken={authToken} authTokenMember={authTokenMember}>
              <Layout authToken={authToken} authTokenMember={authTokenMember} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
      </Routes>
      {showPopup && <PricePopup onClose={() => setShowPopup(false)} />}
    </Router>
  );
}

export default App;
