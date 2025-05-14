const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');
const { authorizeStandard, authorizeAdmin } = require('../middleware/authorization');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/'); // make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Get single product
router.get('/:productId', async (req, res) => {
    const product = await Product.findById(req.params.productId);
    res.json(product);
});

// Create product with image upload
router.post('/', authorizeAdmin, upload.array('images'), async (req, res) => {
    const imagePaths = req.files.map(file => file.path);
    const newProduct = new Product({
        ...req.body,
        images: imagePaths
    });
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
