import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import AuthPage from './components/layouts/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import PricePopup from './components/PricePopup';

function App() {
  // Retrieve both user and member tokens from sessionStorage only
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));
  const [authTokenMember, setAuthTokenMember] = useState(sessionStorage.getItem('authTokenMember'));
  const [showPopup, setShowPopup] = useState(false);

  // Handle login success and set auth token
  const handleLoginSuccess = (token, isMember = false) => {
    if (isMember) {
      sessionStorage.setItem('authTokenMember', token); // Store member token
      setAuthTokenMember(token);
    } else {
      sessionStorage.setItem('authToken', token); // Store user token
      setAuthToken(token);
    }
    setShowPopup(true);
  };

  // Handle logout and remove tokens from sessionStorage only
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authTokenMember');
    setAuthToken(null);
    setAuthTokenMember(null);
  };

  useEffect(() => {
    // Can be used for any future logic on token updates
  }, [authToken, authTokenMember]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={authToken || authTokenMember ? <Navigate to="/dashboard" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/member/login"
          element={<AuthPage onLoginSuccess={handleLoginSuccess} isMemberLogin={true} />}
        />
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
