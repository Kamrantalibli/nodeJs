const express = require("express");
const router =  express.Router();
// const path = require("path");

// const db = require("../data/db");

const userController = require("../controllers/user");


router.use("/blogs/category/:slug" , userController.blogs_by_category)

router.use("/blogs/:slug" , userController.blog_details );

router.use("/blogs" , userController.blog_list);

router.use("/" , userController.index);

module.exports = router;