import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthPage.css';
import Login from '../User/Login';
import MemberLogin from '../Member/MemberLogin';
import Register from '../User/Register';
import GoogleSetPassword from '../User/GoogleSetPassword';

const AuthPage = ({ onLoginSuccess, isMemberLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [registerData, setRegisterData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const isGoogleFlow = query.get('google') === 'true';

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
    navigate('/login');
  };
  console.log('isGoogleFlow:', isGoogleFlow);
  return (
    <div className={`auth-container ${isSignUp && !isGoogleFlow ? 'active' : ''} ${isGoogleFlow ? 'google-flow' : ''}`}>
      <div className="form-container sign-in-container">
        {isGoogleFlow ? (
          <GoogleSetPassword />
        ) : isMemberLogin ? (
          <MemberLogin onLoginSuccess={onLoginSuccess} />
        ) : (
          <Login onLoginSuccess={onLoginSuccess} preFillData={registerData} />
        )}
      </div>

      {!isMemberLogin && !isGoogleFlow && (
        <div className="form-container sign-up-container">
          <Register onRegisterSuccess={handleRegisterSuccess} />
        </div>
      )}

      {!isGoogleFlow && (
        <div className="overlay">
          <h1>{isSignUp ? 'Hello, Friend!' : isMemberLogin ? 'Welcome Back, Member!' : 'Welcome Back!'}</h1>
          <p>
            {isMemberLogin
              ? 'Members can log in here, no sign-up available.'
              : isSignUp
                ? 'If you already have an account, please log in here.'
                : "Don't have an account? Sign up now."}
          </p>

          {!isMemberLogin && (
            <button onClick={toggleForm}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthPage;
