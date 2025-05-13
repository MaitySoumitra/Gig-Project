const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/userSchema');
const authMiddleware = require('./authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function generateAccessToken(user) {
    const payload = { user: { _id: user._id, name: user.firstName, email: user.email } };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
    const payload = { user: { _id: user._id } };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ========================
// Google OAuth
// ========================
router.get('/google', (req, res) => {
    const redirectUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email&prompt=select_account`;
    res.redirect(redirectUrl);
});

router.get('/google/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ msg: 'Missing code' });

    try {
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const access_token = tokenRes.data.access_token;

        const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { email, name, picture } = profileRes.data;
        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ');

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.password) {
            const token = generateAccessToken(existingUser);
            const refreshToken = generateRefreshToken(existingUser);
            existingUser.refreshToken = refreshToken;
            await existingUser.save();

            return res.redirect(`${process.env.FRONTEND_REDIRECT_URI}/oauth-success?token=${token}&refreshToken=${refreshToken}`);
        }

        // If no password, redirect to frontend to set one
        return res.redirect(
            `${process.env.FRONTEND_REDIRECT_URI}/google/set-password?google=true&email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&existing=false&photoUrl=${encodeURIComponent(picture)}`
          );
          
    } catch (err) {
        console.error('Google OAuth Error:', err.response?.data || err.message);
        res.status(500).json({ msg: 'Google OAuth failed' });
    }
});


router.post('/google/set-password', async (req, res) => {
    const { email, firstName, lastName, password, confirmPassword, photoUrl } = req.body;
  
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      let user = await User.findOne({ email });
  
      if (user) {
        user.password = hashedPassword;
        user.firstName = user.firstName || firstName;
        user.lastName = user.lastName || lastName;
        user.photo = user.photo || photoUrl;
      } else {
        user = new User({ firstName, lastName, email, password: hashedPassword, photo: photoUrl });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      await user.save();
  
      res.status(201).json({
        msg: 'Account created or updated successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          photo: user.photo,
        },
      });
    } catch (err) {
      console.error('Set Password Error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

// ========================
// Manual Register/Login
// ========================
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword });

        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        const token = generateAccessToken(user);
        res.status(201).json({ msg: 'User registered', token, refreshToken });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ msg: 'Login successful', token, refreshToken });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ========================
// Token Refresh / Logout
// ========================
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ msg: 'Refresh token is required' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ msg: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Refresh token error:', err);
        res.status(401).json({ msg: 'Invalid or expired refresh token' });
    }
});

router.get('/logout', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        user.refreshToken = undefined;
        await user.save();
        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// ========================
// Me / Profile
// ========================

  

// ========================
// Upload Profile Photo
// ========================
router.post('/upload-photo', authMiddleware, upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const base64Photo = req.file.buffer.toString('base64');
    const photoDataURI = `data:${req.file.mimetype};base64,${base64Photo}`;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.photo = photoDataURI;
    await user.save();

    res.json({ msg: 'Photo uploaded', photo: user.photo });
});

module.exports = router;
