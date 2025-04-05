const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function handleRegister(req, res) {
  const { email, password } = req.body;
  console.log(email, password )
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;
  console.log(email, password )
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { handleRegister, handleLogin };