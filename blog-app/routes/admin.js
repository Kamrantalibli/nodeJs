const express = require("express");
const router = express.Router();
// const path = require("path");


router.use("/blogs/create" , (req, res) => {
    res.render("admin/blog-create");
});

router.use("/blogs/:blogid" , (req, res) => {
    res.render("admin/blog-edit");
});

router.use("/blogs" , (req, res) => {
    res.render("admin/blog-list");
});

module.exports = router;