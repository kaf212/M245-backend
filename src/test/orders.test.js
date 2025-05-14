const { createAxiosInstance } = require('./utils');
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User")

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


describe('Order Endpoints', () => {

    test('User can create an order', async () => {
        const res = await userAxios.post('/orders', {
            customerId: userId,
            items: [{
                productId: '681b52c90f853fd23a8437bb',
                quantity: 1,
                price: 19.99
            }],
            totalAmount: 19.99,
            shippingAddress: {
                fullName: 'John Doe',
                addressLine1: '123 Main St',
                city: 'City',
                postalCode: '12345',
                country: 'US'
            }
        });
        orderId = res.data._id;
        expect(res.status).toBe(201);
    });

    test('User can fetch their order by ID', async () => {
        const res = await userAxios.get(`/orders/${orderId}`);
        expect(res.data._id).toBe(orderId);
    });

    test('User can update order status', async () => {
        const res = await userAxios.put(`/orders/${orderId}/status`, {
            status: 'shipped'
        });
        expect(res.data.status).toBe('shipped');
    });
});
