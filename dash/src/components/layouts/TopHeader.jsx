import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../images/ahaan.png';
import './topheader.css';
import UserProfile from './UserProfile';

const TopHeader = ({ authToken, onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (authToken) {
      axios.get('http://localhost:3000/user/me', {
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true
      })
      .then(response => {
      
        setUser(response.data); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching user:", error);  
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false); 
    }
  }, [authToken]); 
  
  const handleLogout = () => {
    onLogout(); 
    navigate('/login'); 
  };

  if (loading) return <div>Loading...</div>;

  return (
    <header className="bg-light py-3 shadow-sm">
      <div className="container d-flex align-items-center justify-content-between">
        <a href="/" className="navbar-brand d-flex align-items-center">
          <img src={Logo} alt="Logo" className="dashboard-logo" style={{ height: '40px' }} />
        </a>
        
        <div className="d-flex align-items-center">
          <a href="/notifications" className="text-dark me-3 position-relative">
            <i className="bi bi-bell fs-4"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>3</span>
          </a>

         
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
