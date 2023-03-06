const express = require("express");
const router = express.Router();

const {Category , validateCategory} = require("../models/category");

router.get("/" , async (req,res) => {
    const categories = await Category.find().populate("products", "name price -_id");
    res.json(categories);
});

router.post("/" , async (req,res) => {
    const { error } = validateCategory(req.body);

    if (error) {
        return res.status(404).json(error.details[0].message);
    }

    const category = new Category({
        name: req.body.name,
        products: req.body.products
    });

    const newCategory = await category.save();
    res.json(newCategory);
});

router.get("/:id" , async (req,res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).send("Cayegory is not defined.");
    }
    res.json(category);
});

router.put("/:id" , async (req,res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).send("Category is not defined.");
    }

    const { error } = validateCategory(req.body);

    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    category.name = req.body.name;

    const updateCategory = await category.save();
    res.json(updateCategory);

});

router.delete("/:id" , async (req,res) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return res.status(404).json(error.details[0].message);
    }
    res.json( category )
});

module.exports = router;