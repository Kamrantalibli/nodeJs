const jwt = require("jsonwebtoken");

module.exports = auth = (req, res, next) => {
    const token = req.header("x-auth-token");  // requestin headerindan tokeni gotururuk 
    if(!token) {
        return res.status(401).send("Acces Denied");
    }

    try{
        const decodedToken = jwt.verify(token, "jwtPrivateKey");  // goturduyumuz tokeni decoded edirik ve bize peyload info gelir
        req.user = decodedToken;
        next();
    }
    catch(ex){ //eyer tryin icideki token verify olunmasa bize bir exception gelecek ve biz bunu catchin icerisinde gostermeliyik 
        return res.status(400).send("Wrong token");
    }
}
