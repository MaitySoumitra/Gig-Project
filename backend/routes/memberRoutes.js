const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');  // Assuming your Member model is in ../models/Member
require('dotenv').config();  // Load environment variables from .env file
const router = express.Router();

// Middleware to verify the member's JWT token
const verifyMemberToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use the correct secret key
        if (decoded.role !== 'member') {
            return res.status(403).json({ message: 'Forbidden: Not a member' });
        }
        req.member = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token', error: err.message });
    }
};

// Member Registration Route
router.post('/', async (req, res) => {
    const { name, email, role, password } = req.body;

    // Check if all required fields are present
    if (!name || !email || !role || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if email is already in use
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new member
        const newMember = new Member({ name, email, role, password: hashedPassword });
        await newMember.save();

        res.status(201).json({ message: 'Member added successfully', member: newMember });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Error adding member', error: error.message });
    }
});

// Member Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const member = await Member.findOne({ email });
        if (!member) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: member._id, name: member.name, email: member.email, role: member.role },
            process.env.JWT_SECRET,  // Use the correct secret key
            { expiresIn: '1h' } // Token expiration time
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Members Route (with optional search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query; 

        let filter = {};
        if (search) {
            const regex = new RegExp(search, 'i'); 
            filter = {
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } }
                ]
            };
        }
        const members = await Member.find(filter);
        res.status(200).json(members); 
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ message: 'Error fetching members', error: error.message });
    }
});

// Logout Route (invalidate the token)
router.get('/logout', verifyMemberToken, async (req, res) => {
    try {
        const member = req.member; // this comes from the verifyMemberToken middleware
        // Log out logic (e.g., removing token on frontend side)
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Refresh Token Route
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ errors: [{ msg: 'Refresh token is required' }] });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Find the member with the refresh token
        const member = await Member.findById(decoded.id);
        if (!member || member.refreshToken !== refreshToken) {
            return res.status(403).json({ errors: [{ msg: 'Invalid refresh token' }] });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { id: member._id, name: member.name, email: member.email, role: member.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(401).json({ errors: [{ msg: 'Invalid or expired refresh token' }] });
    }
});

// Profile Route (to get member details)
router.get('/me', verifyMemberToken, (req, res) => {
    const member = req.member;  // This should be populated by the middleware

    if (!member) {
        return res.status(404).json({ errors: [{ msg: 'Member not found' }] });
    }

    res.json({
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role || 'member'  // Default to 'member' if no role is set
    });
});

module.exports = router;
