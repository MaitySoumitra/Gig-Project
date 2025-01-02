const User = require('../models/userModel');
const response = require('../utils/response');

const registerUser = async (req, res) => {
  try {
    const { name, email, password, gig, addons } = req.body;
    if (!name || !email || !password || !gig) {
      return response.error(res, 'All fields are required');
    }
    const newUser = new User({ name, email, password, gig, addons });
    await newUser.save();
    return response.success(res, 'User successfully registered', newUser);
  } catch (err) {
    return response.error(res, 'Registration failed');
  }
};

module.exports = { registerUser };
