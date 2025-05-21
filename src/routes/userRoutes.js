const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require("bcryptjs")
const {authorizeStandard, authorizeAdmin} = require("../middleware/authorization")
const jwt = require("jsonwebtoken");

// Get all users
router.get('/', authorizeAdmin, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/me', authorizeStandard, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single user
router.get('/:userId', authorizeAdmin, async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.json(user);
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { password, ...rest } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            ...rest,
            password: hashedPassword
        });

        const saved = await newUser.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: err.message });
    }
});

// Login (mock - replace with real auth)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userRole = (user.isAdmin) ? "admin" : "standard"

    const token = jwt.sign(
        { id: user._id, email: user.email, role: userRole },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

router.put('/me', authorizeStandard, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user
router.put('/:userId', authorizeAdmin, async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.json(user);
});



router.delete('/me', authorizeStandard, async (req, res) => {
    try {
        const user = await User.deleteOne({_id: req.user.id})
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({message: "User deleted successfully"})
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user
router.delete('/:userId', authorizeAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    res.sendStatus(204);
});

module.exports = router;
