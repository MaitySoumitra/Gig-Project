import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate here
import axios from 'axios';

function ResetPassword() {
    // Get the reset token from the URL params (using react-router)
    const { token } = useParams(); // `token` is extracted from the URL, e.g., /reset-password/:token
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // Initialize useNavigate

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Check if the passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Send the reset request to the backend
            const response = await axios.post('http://localhost:3000/reset-password', {
                resetToken: token,        // Pass the reset token from the URL
                newPassword,              // The new password
                confirmPassword          // The confirmed password
            });

            setMessage(response.data.msg);
            setError('');
            // Redirect user to login after successful password reset
            setTimeout(() => navigate('/login'), 3000);  // Use navigate here instead of history.push
        } catch (err) {
            setError(err.response.data.errors[0].msg);
            setMessage('');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Reset Your Password</h2>
                <form onSubmit={handleResetPassword}>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="form-input" // Added class name for consistency
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-input" // Added class name for consistency
                    />
                    <button type="submit" className="form-button">Reset Password</button> {/* Added class name */}
                </form>

                {error && <p className="error-text">{error}</p>} {/* Consistent error styling */}
                {message && <p className="success-message">{message}</p>} {/* Consistent success message */}
            </div>
        </div>
    );
}

export default ResetPassword;
