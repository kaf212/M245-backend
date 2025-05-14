const axios = require('axios');
const { API_BASE } = require('./utils');
const mongoose = require('mongoose');
const User = require('../models/User');  // Assuming you have a User model

let adminToken, userToken, adminId, userId;

// Connect to MongoDB for direct database access
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/m245', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Cleanup: Delete users directly from the database before tests
    await deleteUserIfExists('standarduser');
    await deleteUserIfExists('adminuser');
});

// Function to delete user by username
const deleteUserIfExists = async (username) => {
    const user = await User.findOne({ username });
    if (user) {
        await User.deleteOne({ _id: user._id });
        console.log(`User with username "${username}" deleted.`);
    }
};

describe('Authentication', () => {
    test('Register Standard User', async () => {
        const res = await axios.post(`${API_BASE}/users/register`, {
            username: 'standarduser',
            email: 'user@example.com',
            password: 'pass123',
            firstName: 'User',
            lastName: 'Test'
        });
        userId = res.data._id;
        expect(res.status).toBe(201);
    });

    test('Register Admin User', async () => {
        const res = await axios.post(`${API_BASE}/users/register`, {
            username: 'adminuser',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true,
            firstName: 'Admin',
            lastName: 'User'
        });
        adminId = res.data._id;
        expect(res.status).toBe(201);
    });

    test('Login Standard User', async () => {
        const res = await axios.post(`${API_BASE}/users/login`, {
            email: 'user@example.com',
            password: 'pass123'
        });
        userToken = res.data.token;
        expect(userToken).toBeDefined();
    });

    test('Login Admin User', async () => {
        const res = await axios.post(`${API_BASE}/users/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });
        adminToken = res.data.token;
        expect(adminToken).toBeDefined();
    });

    module.exports = { adminToken, userToken, adminId, userId };
});
