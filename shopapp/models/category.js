const { mongoose, Schema } = require("mongoose");
const Joi = require("joi"); //Gelen melumatlar validateproduct() funksiyasinda tipi yoxlanilir sonra databaseye yazilir 


// Yenii bir schema yaradiriq
const categorySchema = mongoose.Schema({
    name: String,
    products: [{type: Schema.Types.ObjectId, ref:"Product"}] //category modeline Product modeli baglayiriq
});

const validateCategory = (category) => {
    const schema = new Joi.object({
      name: Joi.string().min(3).max(30).required(),
      products: Joi.array()
    });
  
    return schema.validate(category);
  };

const Category = mongoose.model("Category" , categorySchema); // Model

module.exports = { Category , validateCategory };