const axios = require('axios');
const { API_BASE } = require('./utils');
const mongoose = require('mongoose');
const User = require('../models/User');  // Assuming you have a User model

let adminToken, userToken, adminId, userId;

afterAll(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/m245', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const User = mongoose.model('User');

        await User.deleteMany({
            email: { $in: ['user@example.com', 'admin@example.com'] }
        });

        await mongoose.disconnect();
        console.log('Test users deleted.');
    } catch (err) {
        console.error('Failed to clean up test users:', err);
    }
});

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
