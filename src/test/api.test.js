// tests/api.test.js
const axios = require('axios');

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

let userId, productId, orderId;

// USER TESTS
describe('User API', () => {
    const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
    };

    it('should register a new user', async () => {
        const res = await api.post('/users/register', user);
        expect(res.status).toBe(201);
        expect(res.data._id).toBeDefined();
        userId = res.data._id;
    });

    it('should login with valid credentials', async () => {
        const res = await api.post('/users/login', {
            email: user.email,
            password: user.password
        });
        expect(res.status).toBe(200);
        expect(res.data.email).toBe(user.email);
    });

    it('should get all users', async () => {
        const res = await api.get('/users');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    it('should get a single user', async () => {
        const res = await api.get(`/users/${userId}`);
        expect(res.status).toBe(200);
        expect(res.data._id).toBe(userId);
    });

    it('should update a user', async () => {
        const res = await api.put(`/users/${userId}`, { firstName: 'Updated' });
        expect(res.status).toBe(200);
        expect(res.data.firstName).toBe('Updated');
    });

    it('should delete a user', async () => {
        const res = await api.delete(`/users/${userId}`);
        expect(res.status).toBe(204);
    });
});

// PRODUCT TESTS
describe('Product API', () => {
    const product = {
        name: 'Test Product',
        description: 'A sample product',
        category: 'Test',
        sizes: [{ size: 'M', stock: 10 }],
        price: 99.99,
        discount: { amount: 10, expiresAt: new Date(Date.now() + 86400000) },
        images: [],
        tags: ['sample'],
        material: 'cotton',
        gender: 'unisex',
        ageGroup: 'adult'
    };

    it('should create a product', async () => {
        const res = await api.post('/products', product);
        expect(res.status).toBe(201);
        expect(res.data._id).toBeDefined();
        productId = res.data._id;
    });

    it('should get all products', async () => {
        const res = await api.get('/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    it('should get a single product', async () => {
        const res = await api.get(`/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.data._id).toBe(productId);
    });

    it('should update a product', async () => {
        const res = await api.put(`/products/${productId}`, { name: 'Updated Product' });
        expect(res.status).toBe(200);
        expect(res.data.name).toBe('Updated Product');
    });

    it('should delete a product', async () => {
        const res = await api.delete(`/products/${productId}`);
        expect(res.status).toBe(204);
    });
});

// ORDER TESTS
describe('Order API', () => {
    let testUserId, testProductId;

    beforeAll(async () => {
        const userRes = await api.post('/users/register', {
            username: 'orderuser',
            email: 'order@example.com',
            password: 'password123'
        });
        testUserId = userRes.data._id;

        const productRes = await api.post('/products', {
            name: 'Order Product',
            price: 50,
            sizes: [{ size: 'L', stock: 5 }]
        });
        testProductId = productRes.data._id;
    });

    const order = {
        customerId: '',
        items: [],
        totalAmount: 50,
        shippingAddress: {
            fullName: 'Order User',
            addressLine1: '123 Street',
            city: 'City',
            postalCode: '12345',
            country: 'Country'
        }
    };

    it('should create an order', async () => {
        order.customerId = testUserId;
        order.items = [{ productId: testProductId, quantity: 1, price: 50 }];
        const res = await api.post('/orders', order);
        expect(res.status).toBe(201);
        expect(res.data._id).toBeDefined();
        orderId = res.data._id;
    });

    it('should get all orders', async () => {
        const res = await api.get('/orders');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    it('should get orders by user ID', async () => {
        const res = await api.get(`/orders/user/${testUserId}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    it('should get a single order', async () => {
        const res = await api.get(`/orders/${orderId}`);
        expect(res.status).toBe(200);
        expect(res.data._id).toBe(orderId);
    });

    it('should update order status', async () => {
        const res = await api.put(`/orders/${orderId}/status`, { status: 'shipped' });
        expect(res.status).toBe(200);
        expect(res.data.status).toBe('shipped');
    });

    it('should delete an order', async () => {
        const res = await api.delete(`/orders/${orderId}`);
        expect(res.status).toBe(204);
    });
});
