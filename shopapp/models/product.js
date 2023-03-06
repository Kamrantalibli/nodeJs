const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const commentSchema = mongoose.Schema({
    text: String,
    username: String,
    date: {
        type: Date,
        default: Date.now
    },
    users: { type: Schema.Types.ObjectId, ref: "User" }
});

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    isActive: Boolean,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    comments: [commentSchema]
});

function validateProduct(product) {
    const schema = new Joi.object({
        name: Joi.string().min(3).max(30).required(),
        price: Joi.number().required(),
        description: Joi.string(),
        imageUrl: Joi.string(),
        isActive: Joi.boolean(),
        category: Joi.string(),
        comments: Joi.array()
    });

    return schema.validate(product);
}

const Product = mongoose.model("Product", productSchema); 
const Comment = mongoose.model("Comment", commentSchema); 

module.exports = { Product,Comment , validateProduct };