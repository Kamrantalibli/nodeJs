const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("token ", token);
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                message: "Token access expired"
            });
        }
        else if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                message: "Trying to access with an invalid token"
            });
        }
        else {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }
    }
}