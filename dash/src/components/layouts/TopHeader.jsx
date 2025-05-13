import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../images/ahaan.png';
import './topheader.css';
import UserPopup from './UserPopup';
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaBars, FaUserCircle } from "react-icons/fa";

const TopHeader = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const popupRef = useRef(null);

  const togglePopup = () => {
    setShowPopup(prev => !prev);
  };

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [navigate]);

  // outside click event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        showPopup
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <header className="bg-light py-3 shadow-sm">
      <div className="container d-flex align-items-center justify-content-between">
        <a href="/" className="navbar-brand d-flex align-items-center">
          <img src={Logo} alt="Logo" className="dashboard-logo" style={{ height: '40px' }} />
        </a>

        <div className="d-flex align-items-center gap-2" style={{ position: 'relative' }}>
          <div
            className="user-profile"
            onClick={togglePopup}
            ref={profileRef}
            style={{ cursor: 'pointer' }}
          >
            <FaBars className='user-profile-icon' />
            <FaUserCircle className='user-profile-icon' />
          </div>

          {showPopup && (
            <div
              ref={popupRef} // ✅ attach the ref here!
              style={{ position: 'absolute', top: '55px', right: '-30px' }}
            >
              <UserPopup user={user} onLogout={handleLogout} />
            </div>
          )}


          <a href="/notifications" className="text-dark me-3 position-relative">
            <IoIosNotificationsOutline style={{ fontSize: "1.5rem" }} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>3</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
