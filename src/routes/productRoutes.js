const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {authorizeStandard, authorizeAdmin} = require("../middleware/authorization");

// Get all products
router.get('/', authorizeStandard, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Get single product
router.get('/:productId', authorizeStandard, async (req, res) => {
    const product = await Product.findById(req.params.productId);
    res.json(product);
});

// Create product
router.post('/', authorizeAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
});

// Update product
router.put('/:productId', authorizeAdmin, async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    res.json(product);
});

// Delete product
router.delete('/:productId', authorizeAdmin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.productId);
    res.sendStatus(204);
});

module.exports = router;
