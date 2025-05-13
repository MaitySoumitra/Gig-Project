import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './MemberLogin.css';

const MemberLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const resetErrors = () => setErrors([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    resetErrors();
    setLoading(true);

    try {
      // Send login request for member
      const response = await axios.post('http://localhost:3000/api/member/login', { email, password });
      console.log('Backend Response:', response.data);  // Log the full response
      const token = response.data.token;  // Ensure token is correctly extracted
  
      if (token) {
        // Save the member token separately (authTokenMember)
        if (rememberMe) {
          localStorage.setItem('authTokenMember', token);  // Store in localStorage for member
        } else {
          sessionStorage.setItem('authTokenMember', token);  // Store in sessionStorage for member
        }
  
        // Redirect to member dashboard
        navigate('/dashboard');
        toast.success('Member login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors([{ msg: 'Invalid credentials, please try again!' }]);
      toast.error('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Member Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
         
          <button type="submit" disabled={loading} className="premium-login-button mt-4">Login</button>
        </form>
        {loading && <div>Loading...</div>}
        {errors.length > 0 && <div>{errors[0].msg}</div>}
      </div>
    </div>
  );
};

export default MemberLoginPage;
