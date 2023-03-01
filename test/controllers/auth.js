const db = require("../data/db");

exports.post_register = async (req,res,next) => {
    const {name,email,password} = req.body;

    try {
        const [users, ] = await db.execute("select * from users where email=?", [email]);
        console.log(users[0]);
        if (users.length > 0) {
            return res.json({message: "bu email ile oturum acilib"})
        }
        await db.execute("INSERT INTO users (fullname, email, password) VALUES (?, ?, ? );", [name,email,password])
        res.json({message: "Melumat ugurla qeyd olundu", user: users[0]})
        
    } catch (err) {
        next(err)
    }
}