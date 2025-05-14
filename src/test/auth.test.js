const axios = require('axios');
const { API_BASE } = require('./utils');

let adminToken, userToken, adminId, userId;

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
