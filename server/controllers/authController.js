const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, roll, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ roll }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      roll,
      email,
      password,
      isAdmin: roll === process.env.ADMIN_ROLL, // Admin if roll matches
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, roll: user.roll, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        roll: user.roll,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { roll, password } = req.body;

    // Find user by roll
    const user = await User.findOne({ roll });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, roll: user.roll, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        roll: user.roll,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
