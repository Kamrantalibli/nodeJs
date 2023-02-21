const express = require("express");
const router = express.Router();
// const path = require("path");

// const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");

const adminController = require("../controllers/admin");
//Blogs
router.get("/blog/delete/:blogid" , adminController.get_blog_delete);

router.post("/blog/delete/:blogid" , adminController.post_blog_delete);

router.get("/blog/create" , adminController.get_blog_create);

router.post("/blog/create" , imageUpload.upload.single("image") , adminController.post_blog_create);

router.get("/blogs/:blogid" , adminController.get_blog_edit);

router.post("/blogs/:blogid" , imageUpload.upload.single("image") , adminController.post_blog_edit);

router.get("/blogs" , adminController.get_blogs);

//Categories
router.post("/categories/remove" , adminController.get_category_remove);

router.get("/categories/delete/:categoryid" , adminController.get_category_delete);

router.post("/categories/delete/:categoryid" , adminController.post_category_delete);

router.get("/category/create" , adminController.get_category_create);

router.post("/category/create" , adminController.post_category_create);

router.get("/categories/:categoryid" , adminController.get_category_edit);

router.post("/categories/:categoryid" , adminController.post_category_edit);

router.get("/categories" , adminController.get_categories);

module.exports = router; 