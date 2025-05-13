import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast } from 'react-toastify';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // You can keep the UI if desired
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
        sessionStorage.setItem('authToken', token); // Only use sessionStorage
        onLoginSuccess(token);
        navigate('/dashboard');
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response && error.response.data) {
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
          <div>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
          </div>
          <button type="submit" disabled={loading}>Login</button>
        </form>

        {loading && <div className="loading">Logging in...</div>}
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-text">
                {error.msg}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
