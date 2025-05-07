const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders (admin)
router.get('/', async (req, res) => {
    const orders = await Order.find().populate('customerId items.productId');
    res.json(orders);
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
    const orders = await Order.find({ customerId: req.params.userId }).populate('items.productId');
    res.json(orders);
});

// Get single order
router.get('/:orderId', async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate('items.productId');
    res.json(order);
});

// Create order
router.post('/', async (req, res) => {
    const newOrder = new Order(req.body);
    const saved = await newOrder.save();
    res.status(201).json(saved);
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status: req.body.status }, { new: true });
    res.json(order);
});

// Delete order
router.delete('/:orderId', async (req, res) => {
    await Order.findByIdAndDelete(req.params.orderId);
    res.sendStatus(204);
});

module.exports = router;
