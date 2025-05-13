import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const GoogleSetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    photoUrl: '',
  });

  const [existingUser, setExistingUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get('email');
    const firstName = query.get('firstName');
    const lastName = query.get('lastName');
    const existing = query.get('existing') === 'true';
    const photoUrl = query.get('photoUrl');

    if (email) {
      setFormData(prev => ({
        ...prev,
        email,
        firstName,
        lastName,
        photoUrl: photoUrl || '',
      }));
      setExistingUser(existing);
    } else {
      toast.error('Missing email information from Google login.');
      navigate('/login');
    }
  }, [location, navigate]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const { email, firstName, lastName, password, confirmPassword, photoUrl } = formData;

    try {
      const res = await axios.post('http://localhost:3000/auth/google/set-password', {
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        photoUrl,
      });

      sessionStorage.setItem('authToken', res.data.token);
      toast.success('Password set successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>{existingUser ? 'Set Your Password' : 'Complete Your Signup'}</h2>

      {formData.photoUrl && (
        <img
          src={formData.photoUrl}
          alt="Profile"
          style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px' }}
        />
      )}

      <p>{formData.email}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="premium-login-button mt-4" disabled={loading}>
          {loading ? 'Saving...' : 'Set Password'}
        </button>
      </form>
    </div>
  );
};

export default GoogleSetPassword;
