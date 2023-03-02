const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");


router.post("/register" , authController.post_register);
router.post("/login" , authController.post_login);

router.get("/logout" , authController.get_logout);

router.get("/reset-password" , authController.get_reset);
router.post("/reset-password" , authController.post_reset);


module.exports = router;
