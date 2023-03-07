module.exports = (req, res, next) => {
    if(!req.user.isAdmin) {
        return res.status(403).send("You are not authorized to access.");
    }
    next();
}