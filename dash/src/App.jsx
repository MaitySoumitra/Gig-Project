import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import AuthPage from './components/layouts/AuthPage'; // Import AuthPage
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import PricePopup from './components/PricePopup';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
  const [showPopup, setShowPopup] = useState(false);

  // Handle login success and set auth token
  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);  // Store token in localStorage
    setAuthToken(token);  // Update the token state
    setShowPopup(true);
  };

  // Handle logout and remove token
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Clear token from localStorage
    setAuthToken(null);  // Reset the token state
  };

  useEffect(() => {
    // Optional: Check authToken in useEffect to perform any side-effects like redirects
  }, [authToken]);

  return (
    <Router>
      <Routes>
        {/* If the user is logged in, redirect to /dashboard */}
        <Route
          path="/"
          element={authToken ? <Navigate to="/dashboard" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />}
        />
        
        {/* AuthPage handles both Login and Register toggles */}
        <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
        
        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute authToken={authToken}>
              <Layout authToken={authToken} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
      </Routes>
      {showPopup && <PricePopup onClose={() => setShowPopup(false)} />}
     
    </Router>
  );
}

export default App;
