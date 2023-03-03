const express = require("express");
const router = express.Router();
const checkJwt = require("../middleware/jwt");
const userController = require("../controllers/user");


router.delete("/blogs/:id" , userController.delete_blog);
router.get("/blogs/:id" , userController.get_blog_edit);
router.put("/blogs/:id" , userController.put_blog_edit);

router.get("/blogs" ,checkJwt, userController.get_blog);
router.post("/blogs" , userController.post_blog);


module.exports = router;