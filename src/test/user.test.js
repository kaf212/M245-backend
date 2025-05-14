const { createAxiosInstance } = require('./utils');
const axios = require("axios");
const mongoose = require("mongoose")
const User = require("../models/User")

let standardToken, adminToken;
let userAxios, adminAxios;
let userId;

beforeAll(async () => {
    try {
        // Register standard user
        const userRes = await axios.post('http://localhost:5000/api/users/register', {
            email: 'standard@test.com',
            username: 'standardUser',
            password: 'password123',
            isAdmin: 'false',
        });

        userId = userRes.data._id

        const loginUser = await axios.post('http://localhost:5000/api/users/login', {
            email: 'standard@test.com',
            password: 'password123',
        });

        standardToken = loginUser.data.token;
        userAxios = createAxiosInstance(standardToken);
        console.log(userAxios !== undefined)

    } catch (err) {
        console.error('Standard user login failed:', err.response?.data || err);
    }

    try {
        // Register admin user
        await axios.post('http://localhost:5000/api/users/register', {
            email: 'admin@test.com',
            username: 'adminUser',
            password: 'password123',
            isAdmin: 'true',
        });

        const loginAdmin = await axios.post('http://localhost:5000/api/users/login', {
            email: 'admin@test.com',
            password: 'password123',
        });

        adminToken = loginAdmin.data.token;
        adminAxios = createAxiosInstance(adminToken);
        console.log(userAxios !== undefined)


    } catch (err) {
        console.error('Admin user login failed:', err.response?.data || err);
    }
});

afterAll(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/m245', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const User = mongoose.model('User');

        await User.deleteMany({
            email: { $in: ['standard@test.com', 'admin@test.com'] }
        });

        await mongoose.disconnect();
        console.log('Test users deleted.');
    } catch (err) {
        console.error('Failed to clean up test users:', err);
    }
});

describe('User Endpoints', () => {
    console.log(userAxios)
    console.log(adminAxios)
    test('Admin can fetch all users', async () => {
        const res = await adminAxios.get('/users');
        expect(Array.isArray(res.data)).toBe(true);
    });

    test('Admin can fetch a user by ID', async () => {
        const res = await adminAxios.get(`/users/${userId}`);
        expect(res.data._id).toBe(userId);
    });

    test('Standard user can update themselves', async () => {
        const res = await userAxios.put(`/users/${userId}`, {
            phone: '123456789'
        });
        expect(res.data.phone).toBe('123456789');
    });
});
