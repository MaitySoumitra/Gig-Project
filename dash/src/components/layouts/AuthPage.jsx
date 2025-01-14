import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import Login from '../User/Login'; // User Login component
import MemberLogin from '../Member/MemberLogin'; // Member Login component
import Register from '../User/Register'; // Register component for users

const AuthPage = ({ onLoginSuccess, isMemberLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Flag to toggle sign-up/login form for user
  const [registerData, setRegisterData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp((prevState) => !prevState);
    if (isSignUp) {
      navigate('/login'); // Redirect to user login
    } else {
      navigate('/register'); // Redirect to register page (for user)
    }
  };

  const handleRegisterSuccess = (email, password) => {
    setRegisterData({ email, password });
    setIsSignUp(false);
    navigate('/login'); // After registration success, navigate to user login
  };

  return (
    <div className={`auth-container ${isSignUp ? 'active' : ''}`}>
      {/* User or Member Login Form */}
      <div className="form-container sign-in-container">
        {isMemberLogin ? (
          <MemberLogin onLoginSuccess={onLoginSuccess} /> // Render member login form
        ) : (
          <Login
            onLoginSuccess={onLoginSuccess}
            preFillData={registerData}
          /> // Render user login form
        )}
      </div>

      {/* Only show sign-up container if it's not member login */}
      {!isMemberLogin && (
        <div className="form-container sign-up-container">
          <Register onRegisterSuccess={handleRegisterSuccess} />
        </div>
      )}

      <div className="overlay">
        <h1>{isMemberLogin ? 'Welcome Back, Member!' : 'Welcome Back!'}</h1>
        <p>
          {isMemberLogin
            ? 'Members can log in here, no sign-up available.'
            : 'If you already have an account, please log in here.'}
        </p>
        {/* Only show the toggle button if it's not member login */}
        {!isMemberLogin && (
          <button onClick={toggleForm}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
