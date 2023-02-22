const express = require("express");
const router = express.Router();
// const path = require("path");

// const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");
const isAuth = require("../middleware/auth");
const adminController = require("../controllers/admin");

//Blogs
router.get("/blog/delete/:blogid" , isAuth , adminController.get_blog_delete);

router.post("/blog/delete/:blogid" , isAuth , adminController.post_blog_delete);

router.get("/blog/create" , isAuth , adminController.get_blog_create);

router.post("/blog/create" , isAuth , imageUpload.upload.single("image") , adminController.post_blog_create);

router.get("/blogs/:blogid" , isAuth , adminController.get_blog_edit);

router.post("/blogs/:blogid" , isAuth , imageUpload.upload.single("image") , adminController.post_blog_edit);

router.get("/blogs" , isAuth , adminController.get_blogs);

//Categories
router.post("/categories/remove" , isAuth , adminController.get_category_remove);

router.get("/categories/delete/:categoryid" , isAuth , adminController.get_category_delete);

router.post("/categories/delete/:categoryid" , isAuth , adminController.post_category_delete);

router.get("/category/create" , isAuth , adminController.get_category_create);

router.post("/category/create" , isAuth , adminController.post_category_create);

router.get("/categories/:categoryid" , isAuth , adminController.get_category_edit);

router.post("/categories/:categoryid" , isAuth , adminController.post_category_edit);

router.get("/categories" , isAuth , adminController.get_categories);

module.exports = router; 