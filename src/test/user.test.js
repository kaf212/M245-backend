const { adminToken, userToken, userId } = require('./auth.test.js');
const { createAxiosInstance } = require('./utils');

describe('User Endpoints', () => {
    const adminAxios = createAxiosInstance(adminToken);
    const userAxios = createAxiosInstance(userToken);

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
