const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "35eac9dc4cb84d",
        pass: "ff2eec711dfbbf"
    }
});

module.exports = transporter;