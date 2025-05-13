import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '', // changed from 'username' to 'firstName'
    lastName: '', // added lastName
    email: '',
    password: '',
    confirmPassword: '',
    errors: [],
  });

  const { firstName, lastName, email, password, confirmPassword, errors } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      errors: [],
    }));

    if (password !== confirmPassword) {
      setFormData((prevData) => ({
        ...prevData,
        errors: [{ msg: 'Passwords do not match' }],
      }));
      return;
    }

    try {
      // Adjusted the payload to include firstName and lastName
      const response = await axios.post('http://localhost:3000/user/register', {
        firstName,  // changed from username to firstName
        lastName,   // added lastName
        email,
        password,
        confirmPassword,
      });

      // On successful registration, pass the email and password to the parent component
      onRegisterSuccess(email, password);
    } catch (error) {
      setFormData((prevData) => ({
        ...prevData,
        errors: error.response?.data?.errors || [{ msg: 'Server error' }],
      }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="firstName"  // changed name from 'username' to 'firstName'
            placeholder="First Name"
            value={firstName}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="lastName"  // added lastName input field
            placeholder="Last Name"
            value={lastName}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
            required
            className="form-input"
          />
          <button type="submit" className="premium-login-button mt-3">Register</button>
        </form>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-text">{error.msg}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
