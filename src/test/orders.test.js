const { userToken, userId } = require('./auth.test.js');
const { createAxiosInstance } = require('./utils');

let orderId;

describe('Order Endpoints', () => {
    const userAxios = createAxiosInstance(userToken);

    test('User can create an order', async () => {
        const res = await userAxios.post('/orders', {
            customerId: userId,
            items: [{
                productId: 'productObjectIdHere', // replace with actual product ID
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
