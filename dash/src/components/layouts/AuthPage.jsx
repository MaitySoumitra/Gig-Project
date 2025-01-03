import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import Login from '../User/Login';
import Register from '../User/Register';

const AuthPage = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [registerData, setRegisterData] = useState({ email: '', password: '' });
  const navigate = useNavigate(); 

  const toggleForm = () => {
    setIsSignUp((prevState) => !prevState); 
    if (isSignUp) {
      navigate('/login'); 
    } else {
      navigate('/register'); 
    }
  };

  const handleRegisterSuccess = (email, password) => {
    setRegisterData({ email, password });
    setIsSignUp(false);
    navigate('/login');  // After successful registration, navigate to login
  };

  return (
    <div className={`auth-container ${isSignUp ? 'active' : ''}`}>
      <div className="form-container sign-in-container">
        <Login
          onLoginSuccess={onLoginSuccess}
          preFillData={registerData} // Pass the registerData to pre-fill the login form
        />
      </div>

      <div className="form-container sign-up-container">
        <Register onRegisterSuccess={handleRegisterSuccess} />
      </div>

      <div className="overlay">
        <h1>{isSignUp ? 'Hello, User!' : 'Welcome Back!'}</h1>
        <p>
          {isSignUp
            ? "If you don't have an account, please sign up here."
            : 'If you already have an account, please log in here.'}
        </p>
        <button onClick={toggleForm}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
