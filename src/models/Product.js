const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }
}, { _id: false });

const discountSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    expiresAt: { type: Date, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    sizes: [sizeSchema],
    price: { type: Number, required: true },
    discount: discountSchema,
    images: [String],
    tags: [String],
    material: { type: String },
    gender: { type: String },
    ageGroup: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
