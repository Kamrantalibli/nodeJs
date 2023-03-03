const config = require("../config");
const db = require("../data/db");
const bcrypt = require("bcrypt");
const  transporter  = require("../helpers/send-mail");
const jwt = require("jsonwebtoken");

exports.post_register = async (req,res,next) => {
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const [users, ] = await db.execute("select * from users where email=?", [email]);
        console.log(users[0]);
        if (users.length > 0) {
            return res.json({message: "bu email ile oturum acilib" , status: 200 })
        }
        await db.execute("INSERT INTO users (fullname, email, password,createdAt,updatedAt) VALUES (?, ?, ?, NOW(), NOW())", [name,email,hashedPassword]);

        transporter.sendMail({
            from: config.email.from,
            to: email,
            subject: "Account created",
            html: `<b>Please confirm your account!</b> <a href="https://nodemailer.com/about/">Click</a>`,
        });

        res.json({message: "Melumat ugurla qeyd olundu", status: 200});

    } catch (err) {
        next(err);
    }
}

exports.post_login = async (req,res,next) => {
    const {email, password} = req.body;

    try {
        // Email control
        const [user , ] = await db.execute("select * from users where email=?" , [email]);
        console.log(user[0]);
        if(!user[0]){
            return res.json({message: "Email not found" ,status: 200});
        }else{
            // Password control
            const match = await bcrypt.compare(password, user[0].password);
            console.log(match);
            if (match) {
                //Login Success
                const token = jwt.sign({
                    email:email,
                    userid: user[0].id,
                    exp: Math.floor(Date.now() / 1000)+60
                },process.env.SECRET_KEY)
                //session
                req.session.isAuth = true;
                req.session.fullname = user[0].fullname;
                req.session.userid = user[0].id;
                return res.json({ 
                    token: token,
                    message: "Success", 
                });
            }
            else{
                // Login Wrong
                res.json({
                    message: "Login or password wrong", 
                    status: 200
                });
            }
        }
        res.json({
            message: "sss"
        })
        
    } catch (err) {
        next(err);
    }
}

exports.get_logout = async(req, res, next) => {
    try {
        req.session.destroy();
    } catch (err) {
        next(err);
    }
}

exports.get_reset = async (req, res, next) => {
    const message = req.session.message;
    delete req.session.message
    try {
        return res.json({message: message , title: "Reset Password"});
    } catch (err) {
        next(err);
    }
}

exports.post_reset = async (req, res, next) => {
    const { email } = req.body;

    try {
        const [user , ] = await db.execute("SELECT * FROM users where email = ? " , [email]);

        if (!user[0]) {
            req.session.message = "Email not found";
            return res.json({message: req.session.message});
        }
        else{
            

            transporter.sendMail({
                from: config.email.username,
                to: email,
                subject: "New Password",
                html: `
                    <p>Click Reset Pssword</p>
                    <a href="http://localhost:3000/account/new-password">Reset Password</a>                
                `
            });

            req.session.message = "Reset-Password sent to your email"
            return res.status(200).json({
                message:req.session.message , 
                status:200 , 
                method:"POST"});
        }
    } catch (err) {
        next(err);
    }
}