// src/components/User/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');

    if (token && refreshToken) {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('refreshToken', refreshToken);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return <p>Signing you in via Google...</p>;
};

export default OAuthSuccess;
