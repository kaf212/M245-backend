const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const {authorizeStandard} = require("../middleware/authorization");

// Get all orders (admin)
router.get('/', authorizeStandard, async (req, res) => {
    const orders = await Order.find().populate('customerId items.productId');
    res.json(orders);
});

// Get orders by user ID
router.get('/user/:userId', authorizeStandard, async (req, res) => {
    const orders = await Order.find({ customerId: req.params.userId }).populate('items.productId');
    res.json(orders);
});

// Get single order
router.get('/:orderId', authorizeStandard, async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate('items.productId');
    res.json(order);
});

// Create order
router.post('/', authorizeStandard, async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const saved = await newOrder.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: err})
    }
});

// Update order status
router.put('/:orderId/status', authorizeStandard, async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status: req.body.status }, { new: true });
    res.json(order);
});

// Delete order
router.delete('/:orderId', authorizeStandard, async (req, res) => {
    await Order.findByIdAndDelete(req.params.orderId);
    res.sendStatus(204);
});

module.exports = router;
