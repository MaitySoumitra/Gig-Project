import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    // Fetch user data from the backend on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Fetch user data from backend
                const response = await axios.get('http://localhost:3000/user/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
                setImage(response.data.photo || '');
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Error fetching user data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const token = sessionStorage.getItem('authToken');
            const response = await axios.post('http://localhost:3000/user/upload-photo', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUser({ ...user, photo: response.data.photo });
            setImage(response.data.photo);
        } catch (err) {
            console.error('Error uploading image:', err);
        }
    };

    // Logout function
    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-5">
            {user ? (
                <div className="text-center">
                    <div>
                        <label htmlFor="profile-image-upload">
                            <img
                                src={image || user.photo || 'https://via.placeholder.com/150'}
                                alt="User"
                                className="rounded-circle"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                }}
                            />
                        </label>
                        <input
                            type="file"
                            id="profile-image-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="mt-4">
                        <h5>{user.firstName} {user.lastName}</h5>
                        <p>{user.email}</p>
                    </div>
                    <Button variant="outline-dark" onClick={handleLogout}>Logout</Button>
                </div>
            ) : (
                <div>
                    <Link to="/login">Login</Link>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
