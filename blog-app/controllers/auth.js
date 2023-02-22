const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.get_register = async (req, res) => {
  try {
    return res.render("auth/register", {
      title: "Register",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_register = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.findOne({where: {email: email}});
    if(user){
      req.session.message = {text: "An account has been created with email" , class: "warning"};
      return res.redirect("login");
    }
    await User.create({
      fullname: name,
      email: email,
      password: hashedPassword,
    });
    req.session.message = { text: "You can login to your account" , class: "success"};
    return res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};

exports.get_login = async (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/login", {
      title: "Login",
      message: message
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_logout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect("/account/login");
    } catch (err) {
      console.log(err);
    }
  };
  

exports.post_login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({
      where: {
        email: email
      },
    });

    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        message: { text: "Email is wrong" , class: "danger"}
      });
    }

    //Password control
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Login succes 
      // session
        req.session.isAuth = true;
        req.session.fullname = user.fullname;
      // session in db
      // token-based auth - api
      const url = req.query.returnUrl ? req.query.returnUrl : "/";
      return res.redirect(url);
    }

    //Login wrong
    return res.render("auth/login", {
      title: "Login",
      message: { text: "Email or password wrong" , class: "danger"}
    });
  } catch (err) {
    console.log(err);
  }
};
