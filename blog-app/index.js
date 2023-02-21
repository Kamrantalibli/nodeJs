const express = require("express");
const port = 3000;

const app = express();

app.set("view engine" , "ejs");
app.use(express.urlencoded({extended: false})); //request body icindeki name leri oxumaq ucun istifade olunur 

const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use("/libs" , express.static(path.join(__dirname, "node_modules")));
app.use("/static" , express.static(path.join(__dirname ,"public")));

app.use("/admin", adminRoutes);
app.use(userRoutes);

const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const Category = require("./models/category");
const Blog = require("./models/blog");
//relations


// one to many
// Category.hasMany(Blog, {
//   foreignKey: {
//     name: "categoryId",
//     allowNull: false  
//   },
//   // inDelete:"SET NULL",
//   // inUpdate:"SET NULL",
// });
// Blog.belongsTo(Category);


Blog.belongsToMany(Category, { through: "blogCategories" });
Category .belongsToMany(Blog, { through: "blogCategories" });






//implementation - sync

// IIFE
(async ()=>{
  await sequelize.sync({ force: true });
  await dummyData();
})()

app.listen(port, () => {
  console.log("listening on port: ",port);
});
