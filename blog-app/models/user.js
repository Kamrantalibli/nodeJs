const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const bcrypt = require("bcrypt");


const User = sequelize.define("user", {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Fullname can not be empty"
            },
            isFullname(value){    // value istifadecinin fullname -ne breaber olur 
                if(value.split(" ").length < 2) {
                    throw new Error("Please enter your first and last name.")
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "An account has been created with email."
        },
        validate: {
            notEmpty: {
                msg: "Please enter your email."
            },
            isEmail: {
                msg: "Enter email adress for example 'example@example.com'."
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Enter you password"
            },
            len: {
                args: [5, 10],
                msg: "Password must be 5-20 characters length"
            }
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiration : {
        type: DataTypes.DATE,
        allowNull: true
    }
},
{
    timestamps: true
});

User.afterValidate(async (user) => {
    user.password = await bcrypt.hash(user.password,10);
});

module.exports = User;

