const express = require("express");
const router = express.Router();
const { User, validateRegister, validateLogin } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/" , async (req, res) => {
    res.send();
});

/// api/users/create : POST
router.post("/create" , async (req, res) => {  // Register
    const { error } = validateRegister(req.body);
    
    if (error) {
        return res.status(400).json(error.details[0].message);        
    }


    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send("This Email has already been account");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    await user.save();

    const token = user.createAuthToken();  //burada createAuthToken() => "user"-in "id"-ni goturub uygun bir token yaradir

    res.header("x-auth-token", token).json(user);
});

/// api/users/auth : POST
router.post("/auth" , async (req, res) => {   // Login
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if(!user){
        return res.status(400).send("Email or Password wrong");
    }

    const isSuccess = await bcrypt.compare(req.body.password , user.password); // => Password yoxlanisi (true/false)
    if (!isSuccess) {
        return res.status(400).send("Email or Password wrong");
    }

    const token = user.createAuthToken(); //burada createAuthToken() => "user"-in "id"-ni goturub uygun bir token yaradir  

    res.send(token);

});



module.exports = router;