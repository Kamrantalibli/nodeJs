const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");


router.post("/register" , authController.post_register);


module.exports = router;
