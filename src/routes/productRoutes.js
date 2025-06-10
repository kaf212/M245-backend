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

router.post(
    '/',
    authorizeAdmin,
    upload.array('images', 10),  // <-- important: 'images' here must match the formData field name
    async (req, res) => {
        try {
            console.log('req.body:', req.body);   // all non-file fields, string or JSON strings
            console.log('req.files:', req.files); // array of uploaded file info

            const sizes = JSON.parse(req.body.sizes || '[]');
            const tags = JSON.parse(req.body.tags || '[]');
            const discount = req.body.discount ? JSON.parse(req.body.discount) : { amount: 0, expiresAt: null };

            const imagePaths = (req.files || []).map(file => '/images/' + file.filename);

            const newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: Number(req.body.price),
                sizes,
                discount,
                material: req.body.material,
                gender: req.body.gender,
                ageGroup: req.body.ageGroup,
                images: imagePaths,
                tags,
            });

            const saved = await newProduct.save();
            res.status(201).json(saved);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
);


// Serve a specific image file
router.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '..', 'images', filename);
    res.sendFile(imagePath, err => {
        if (err) {
            console.error('Image not found:', err);
            res.status(404).json({ error: 'Image not found' });
        }
    });
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
