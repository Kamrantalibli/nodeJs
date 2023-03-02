const User = require("../models/user");
const bcrypt = require("bcrypt");
const transporter = require("../helpers/send-mail");
const config = require("../config");
const crypto = require("crypto");
const { Op } = require("sequelize");

exports.get_register = async (req, res, next) => {
  try {
    return res.render("auth/register", {
      title: "Register",
    });
  } catch (err) {
      next(err);
  }
};

exports.post_register = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // const hashedPassword = await bcrypt.hash(password, 10);
  try {
    // const user = await User.findOne({ where: { email: email } });
    // if (user) {
    //   req.session.message = {
    //     text: "An account has been created with email",
    //     class: "warning",
    //   };
    //   return res.redirect("login");
    // }
    await User.create({
      fullname: name,
      email: email,
      password: password,
    });

    transporter.sendMail({
      from: config.email.username,
      to: email,
      subject: "An account created",
      text: "this is a test email sent from Node.js using Nodemailer.",
    });

    req.session.message = {
      text: "You can login to your account",
      class: "success",
    };
    return res.redirect("login");
  } catch (err) {
      let msg = "";
      if (err.name == "SequelizeValidationError" || err.name == "SequelizeUniqueConstraintError") {
          for(let e of err.errors){
            msg += e.message + " "
          };
          return res.render("auth/register", {
            title: "Register",
            message: {text: msg , class: "warning"}
          });
      }else{
          next(err);
      }
  }
};

exports.get_login = async (req, res, next) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/login", {
      title: "Login",
      message: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.get_logout = async (req, res, next) => {
  try {
    req.session.destroy();
    return res.redirect("/account/login");
  } catch (err) {
    next(err);
  }
};

exports.post_login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.redirect("auth/login", {
        title: "Login",
        message: { text: "Email is wrong", class: "danger" },
      });
    }

    //Password control
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Login succes
      // session
      const userRoles = await user.getRoles({
        attributes:["rolename"],
        raw: true
      })
      req.session.roles = userRoles.map((role) => role["rolename"]); // ["admin","moderator"]
      req.session.isAuth = true;
      req.session.fullname = user.fullname;
      req.session.userid = user.id;
      const url = req.query.returnUrl ? req.query.returnUrl : "/";
      return res.redirect(url);
    }

    //Login wrong
    return res.render("auth/login", {
      title: "Login",
      message: { text: "Email or password wrong", class: "danger" },
    });
  } catch (err) {
      next(err);
  }
};

exports.get_reset = async (req, res, next) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/reset-password", {
      title: "Reset Password",
      message: message,
    });
  } catch (err) {
      next(err);
  }
};

exports.post_reset = async (req, res) => {
  const email = req.body.email;
  try {
    var token = crypto.randomBytes(32).toString("hex"); //nodejs.org da crypto.randomByte bax
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.session.message = { text: "Email not found", class: "danger" };
      return res.redirect("reset-password");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
    await user.save();

    transporter.sendMail({
      from: config.email.username,
      to: email,
      subject: "Reset Password",
      html: `
        <p>Press the Link</p>
        <p>
            <a href="http://localhost:3000/account/new-password/${token}">Reset Password</a>
        </p>
      `,
    });

    req.session.message = {
      text: "Control your email for reset password",
      class: "success",
    };
    return res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};

exports.get_newpassword = async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
    });
    return res.render("auth/new-password", {
      title: "Update Password",
      token: token,
      userId: user.id,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_newpassword = async (req, res) => {
  const token = req.body.token;
  const userId = req.body.userId;
  const newPassword = req.body.password;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
        id: userId,
      },
    });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();

    req.session.message = { text: "Password updated", class: "success" };
    return res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};


