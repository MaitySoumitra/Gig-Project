const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const crypto = require('crypto');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
function generateAccessToken(user) {
    const payload = { user: { _id: user._id, name: user.name, email: user.email } };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
    const payload = { user: { _id: user._id } };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });  // Refresh token valid for 7 days
}

const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Simple validation to check if the required fields are present
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        // Check if the user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch); // Log comparison result

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, msg: 'Login successful' });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ errors: [{ msg: 'Refresh token is required' }] });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Find the user with the refresh token
        const user = await User.findById(decoded.user._id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ errors: [{ msg: 'Invalid refresh token' }] });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });

    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(401).json({ errors: [{ msg: 'Invalid or expired refresh token' }] });
    }
});

router.get('/logout', async (req, res) => {
    try {
        const user = req.user;  // assuming user is set in auth middleware

        // Clear refresh token in the database
        user.refreshToken = undefined;
        await user.save();

        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'No user with that email address' }] });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();
        res.status(200).json({
            msg: 'Password reset token generated successfully',
            resetToken: resetToken,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

router.post('/reset-password', async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    try {
        const user = await User.findOne({ resetToken });
        if (!user || user.resetTokenExpiration < Date.now()) {
            return res.status(400).json({ errors: [{ msg: 'Invalid or expired token' }] });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

router.get('/me', authMiddleware, (req, res) => {
    const user = req.user;  // This should be populated by the middleware

    if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    // Send the updated user details in the response
    res.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photo: user.photo || null,  // Return null if no photo exists
        status: user.status || 'inactive'  // Default to 'inactive' if no status is set
    });
});

router.post('/upload-photo', authMiddleware, upload.single('photo'), async (req, res) => {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
  
      // Convert the file buffer directly into base64
      const base64Photo = req.file.buffer.toString('base64');
  
      // Construct the data URI for the image (including MIME type)
      const photoDataURI = `data:${req.file.mimetype};base64,${base64Photo}`;
  
      // Find the user in the database
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Save the base64 string (Data URI) to the user's photo field
      user.photo = photoDataURI;
      await user.save();
  
      // Return a response with the success message and the photo
      res.json({ msg: 'Profile photo uploaded successfully', photo: user.photo });
    } catch (error) {
      console.error('Upload Photo Error:', error);
      res.status(500).json({ msg: 'Server error' });
    }
  });


module.exports = router;
