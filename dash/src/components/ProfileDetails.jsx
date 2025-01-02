import React from 'react';

const ProfileDetails = ({ profile }) => {
  return (
    <div className="container mt-5">
      <h2>Profile Details</h2>
      <div className="card">
        <div className="card-body">
          <img
            src={profile.profilePicture ? URL.createObjectURL(profile.profilePicture) : ''}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <h5 className="card-title">{profile.name}</h5>
          <p className="card-text"><strong>Email:</strong> {profile.email}</p>
          <p className="card-text"><strong>Phone:</strong> {profile.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;