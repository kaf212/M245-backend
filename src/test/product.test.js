const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const { adminToken, userToken } = require('./auth.test.js');
const { createAxiosInstance } = require('./utils');

let productId;

describe('Product Endpoints', () => {
    const adminAxios = createAxiosInstance(adminToken);
    const userAxios = createAxiosInstance(userToken);

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
