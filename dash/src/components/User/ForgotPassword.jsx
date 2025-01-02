import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/forgot-password', { email });
            setMessage(response.data.msg);
            navigate(`/reset-password/${response.data.resetToken}`); // Redirect to the reset password page with the token
        } catch (err) {
            setError(err.response?.data?.errors[0]?.msg || 'Server error');
        }
    };

    return (
        <div className="login-container">
        <div className="login-card">
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"  // Added class name for consistency
                />
                <button type="submit" className="form-button">Request Reset</button>  
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-text">{error}</p>}
        </div>
    </div>
    );
}

export default ForgotPassword;
