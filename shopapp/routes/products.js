const express = require("express");
const router = express.Router();

const { Product, Comment , validateProduct } = require("../models/product"); 

const products = [
  { id: 1, name: "iphone 12", price: 20000 },
  { id: 2, name: "iphone 13", price: 30000 },
  { id: 3, name: "iphone 14", price: 40000 },
];

// Query opeartors
// eq => equal
// ne => not equal
// gt => greater than
// gte => greater than equal
// lt => less than
// lte => less than equal
// in => [10,20,30]
// nin => [10,20]

router.get("/", async (req, res) => {
  const products = await Product.find()
                                  .populate("category","name -_id")
                                  // .populate({ // bu populate Productun icindeki comments-in icindeki user-i yeni bir tableden getirmek ucundu  
                                  //   path: 'comments',
                                  //   populate: { path: 'user' }
                                  // })
                                  .select("-isActive -comments._id"); //populate => "Productun" baglantili oldugu "Category" datasinida getirir. Burada getirdiyi "name" olacaq lakin '-' den sonra yazdigi hecne gelmeyecek.  
  // const products = await Product.find({isActive: true , price:2500});
  // const products = await Product.find({isActive: true}).limit(1).select({ name: 1 , price: 1});
  // const products = await Product.find({ price: { $eq: 2500 } });
  // const products = await Product.find({ price: { $gte: 1000 , $lte: 3000 } }); // price >=1000  price<=3000
  // const products = await Product.find({ price: { $gte: 1000 , $lte: 3000 }, name: "Samsung" }); // and
  // const products = await Product.find()
  //                                   .or([
  //                                       { price: { $gte: 1000 , $lte: 3000 } }, 
  //                                       { name: "Samsung" }
  //                                   ]); // price >= 1000 or isActive == true
  // res.send(products);

  // startwith
  // const products = await Product.find({ name: /^iphone/ }); // iphone adi il baslayanlar gelsin
  // endwith
  // const products = await Product.find({ name: /iphone$/ }); // iphone sozu ile bitenler gelsin
  // contains
// const products = await Product.find({ name: /.*iphone.*/i }); // icinde iphone sozu kecenler gelsin. yanina  "i" artirildiqda boyuk herf kicik herf nezere alinmayacag hamisi gelecek   
  res.json(products);
});

router.post("/", async (req, res) => {
  //Validate
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    isActive: req.body.isActive,
    category: req.body.category,
    comments: req.body.comments
 });

    const newProduct = await product.save();
    res.json(newProduct);
});

router.post("/comment/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
      return res.status(404).send("Product is not defined. ");
  }

  // Burada bir comment Schemasi yaradiriq
  const comment = new Comment({
    text: req.body.text,
    username: req.body.username
  });

  // Yaratdigimiz comment Schemasini "Product"-in commentine gonderirik.
  product.comments.push(comment);

  //burdada "Product"-u save edirik 
    const updatedProduct = await product.save();
    res.json(updatedProduct);
});

router.delete("/comment/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).send("Product is not defined.");
    }

// id methodu vasitesile alt documetdeki itemin "id"-ne gore sorgulama edir
  const comment = product.comments.id(req.body.commentid);
  console.log(comment);
  comment.remove(); // comment deleted

  const updatedProduct = await product.save(); // save edirik
  res.json(updatedProduct);
});

router.put("/:id", async (req, res) => {
  // // id -e gore product almaq
  // const product = products.find((p) => p.id == req.params.id);


  // // 1 ci update methodu
  // const product = await Product.findByIdAndUpdate({ _id: req.params.id }, {
  //   $set: {
  //     name: req.body.name,
  //     price: req.body.price,
  //     description: req.body.description,
  //     imageUrl: req.body.imageUrl,
  //     isActive: req.body.isActivec
  //   }
  // }, {new: true});

  // res.json(product); // Burada res => update olunan itemin kecmis melumatlari gelir. Eger yeni melumatlarinin gelmesini isteyirikse 3cu parametr kimi {new: true} yazirig.
  // //



  // // 2 ci update methodu
  // const result = await Product.update({ _id: req.params.id }, {
  //   $set: {
  //     name: req.body.name,
  //     price: req.body.price,
  //     description: req.body.description,
  //     imageUrl: req.body.imageUrl,
  //     isActive: req.body.isActivec
  //   }
  // });

  // res.json(result); // Burada res => update olunan item sayi gelecek
  // //



// 3 ci update methodu
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(400).send("Product is not defined.");
  }

  //Validate
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.imageUrl = req.body.imageUrl;
  product.isActive = req.body.isActivec;
  product.category = req.body.category;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
//
});

router.delete("/:id", async (req, res) => {

  // const result = await Product.deleteOne({ _id: req.params.id }); // 1ci method. Bu methodda seyfeye silinen itemlerin sayi gonderilir.
  const product = await Product.findByIdAndDelete(req.params.id); // 2ci method. Bu methodda seyfeye silinen product gonderilir.
  if (!product) {
      return res.status(404).send("Product is not defined. ");
  }
  res.send(product);

});

router.get("/:id", async (req, res) => {
  // const product = await Product.findOne({_id: req.params.id});  //1 ci method 
  const product = await Product.findById(req.params.id).populate("category","name -_id");  //2 ci method. Burada populate ile "category" cedvelinin "name"-ni birlesdiririk

  if (!product) {
    return res.status(404).send("Product is not defined");
  }
  res.json(product);
});

module.exports = router;
