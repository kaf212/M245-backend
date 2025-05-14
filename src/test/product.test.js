const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const { createAxiosInstance } = require('./utils');
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User")

let productId;
let standardToken, adminToken;
let userAxios, adminAxios;
let orderId;
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

        console.log(userRes.data._id)
        userId = userRes.data._id

        const loginUser = await axios.post('http://localhost:5000/api/users/login', {
            email: 'standard@test.com',
            password: 'password123',
        });

        standardToken = loginUser.data.token;
        userAxios = createAxiosInstance(standardToken);

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

describe('Product Endpoints', () => {
    test('Admin can create product with image', async () => {
        const form = new FormData();
        form.append('name', 'Test Product');
        form.append('price', '29.99');
        form.append('sizes[0][size]', 'M');
        form.append('sizes[0][stock]', '10');
        form.append('images', fs.createReadStream(path.join(__dirname, 'sample.jpg')));

        const res = await adminAxios.post('/products', form, {
            headers: form.getHeaders()
        });
        productId = res.data._id;
        expect(res.status).toBe(201);
    });

    test('User can fetch all products', async () => {
        const res = await userAxios.get('/products');
        expect(Array.isArray(res.data)).toBe(true);
    });

    test('User can fetch single product', async () => {
        const res = await userAxios.get(`/products/${productId}`);
        expect(res.data._id).toBe(productId);
    });

    test('Admin can update product', async () => {
        const res = await adminAxios.put(`/products/${productId}`, {
            price: 19.99
        });
        expect(res.data.price).toBe(19.99);
    });
});
