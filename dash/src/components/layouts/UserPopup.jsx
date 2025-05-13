import React, { useState, useRef } from 'react';
import './UserPopup.css';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const UserPopup = ({ user, onLogout }) => {
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const token = sessionStorage.getItem('authToken');
      const res = await axios.post('http://localhost:3000/user/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Update UI (optional: fetch new user data instead)
      window.location.reload(); // or use a callback to update user in parent
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="user-popup">
      <div className="user-info" onClick={handleImageClick}>
        {imageError || !user.photo ? (
          <FaUserCircle className="fallback-icon" />
        ) : (
          <img
            src={user.photo}
            alt="User"
            className="user-image"
            onError={() => setImageError(true)}
          />
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className="user-details">
          <div className="user-name">{user.firstName} {user.lastName}</div>
          <div className="user-role">{user.role || 'User'}</div>
        </div>
      </div>
      <hr />
      <label className="popup-label">Profile</label>
      <p className="popup-item">Activity</p>
      <p className="popup-item">Manage Profile</p>
      <p className="popup-item">Settings</p>
      <hr />
      <p className="popup-item logout" onClick={onLogout}>Logout</p>
    </div>
  );
};

export default UserPopup;
