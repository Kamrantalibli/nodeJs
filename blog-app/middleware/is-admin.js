module.exports = (req,res,next) => {
    if (!req.session.isAuth) {
        return res.redirect("/account/login?returnUrl=" + req.originalUrl); // => return url kecmis yazdigin urlni yeni(originalUrl) tutub login olandan sonra geri gonderir hemin url-ye 
    }
    if(!req.session.roles.includes("admin")) {
        req.session.message = {text: "Login with an authorized user."};
        return res.redirect("/account/login?returnUrl=" + req.originalUrl);
    }
    next();
}