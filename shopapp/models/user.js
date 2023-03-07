const { mongoose, Schema } = require("mongoose");
const Joi = require("joi"); //Gelen melumatlar validateproduct() funksiyasinda tipi yoxlanilir sonra databaseye yazilir 
const jwt = require("jsonwebtoken");

// Yenii bir schema yaradiriq
const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: Boolean
}, { timestamps: true });

const validateRegister = (user) => {   // Regsiter olan istifadecinin melumatlarnin yoxlayir  
    const schema = new Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(3).max(50).required().email(),
      password: Joi.string().min(5).required(),
    });
  
    return schema.validate(user);
  };

const validateLogin = (user) => {        // Login olan istifadecinin melumatlarnin yoxlayir
  const schema = new Joi.object({
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(user);
};

//JWT burada gonderilecek. userShema classi altindaki bir method olacag. Arrowfunction yazmirig cunki arrow function scope yaratmir deye icerisinde "this" yazmaq olmur
userSchema.methods.createAuthToken = function() {
    const decodedToken = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, 'jwtPrivateKey');
    return decodedToken;
};
///////////////////////////////////////////////////////////////////////////////////////////////////

const User = mongoose.model("User" , userSchema); // Model



module.exports = { User , validateRegister, validateLogin };