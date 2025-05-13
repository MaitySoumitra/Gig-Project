import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast } from 'react-toastify';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetErrors = () => setErrors([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    resetErrors();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/user/login', { email, password });
      const token = response.data.token;

      if (token) {
        sessionStorage.setItem('authToken', token);
        onLoginSuccess(token);
        navigate('/dashboard');
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response?.data) {
        setErrors(error.response.data.errors || [{ msg: 'Server error' }]);
        toast.error('Invalid credentials, please try again!');
      } else {
        setErrors([{ msg: 'An error occurred' }]);
        toast.error('An error occurred, please try again later!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google'; // Triggers backend Google OAuth route
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Forgot password link (right aligned) */}
          <div className="forgot-password-wrapper">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          </div>

          {/* Login button */}
          <button type="submit" disabled={loading}  className="premium-login-button">Login</button>

          {/* Divider */}
          <div className="social-login-section">
            <div className="divider">Sign-up with</div>

            <div className="google-login-wrapper">
              <div className="google-login-btn" onClick={handleGoogleLogin}>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="google-icon"
                />
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
