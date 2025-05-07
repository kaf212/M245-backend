const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Get single user
router.get('/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.json(user);
});

// Register new user
router.post('/register', async (req, res) => {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
});

// Login (mock - replace with real auth)
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(user);
});

// Update user
router.put('/:userId', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.json(user);
});

// Delete user
router.delete('/:userId', async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    res.sendStatus(204);
});

module.exports = router;
