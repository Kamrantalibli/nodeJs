// Express
const express = require("express");
const port = 3000;
const app = express();

app.setMaxListeners = Infinity;
const cookieParser = require("cookie-parser"); //insert cookieParser
const session = require("express-session"); //insert express-session
const SequelizeStore = require("connect-session-sequelize")(session.Store); //insert session-sequelize
const csrf = require("csurf"); //Token (Cross Site Request Forgery) 

// Node modules
const path = require("path");

// Routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

// Custom modules
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const locals = require("./middleware/locals");

// Template engine
app.set("view engine", "ejs");

// Models
const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");
const Role = require("./models/role");

// Middleware
app.use(express.urlencoded({ extended: true })); //request body icindeki name leri oxumaq ucun istifade olunur 
app.use(cookieParser()); // CookieParser use
app.use(
  session({
    secret: "hello world",
    resave: false, // -> true olarsa her defe tekrar session save olunur
    saveUninitialized: false, //--> her proqrami istifade eden istifadeci ucun bir session databazasi duzeldeceyini bildirir
    cookies: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

app.use(locals); // -> Middleware butun her yerde istifade olunur.
app.use(csrf());

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);

// Relations
Blog.belongsTo(User);
User.hasMany(Blog);

Blog.belongsToMany(Category, { through: "blogCategories" });
Category.belongsToMany(Blog, { through: "blogCategories" });

Role.belongsToMany(User, {through: "userRoles"});
User.belongsToMany(Role, {through: "userRoles"});
//implementation - sync

// IIFE
(async () => {
  // await sequelize.sync({ force: true });
  // await dummyData();
})();

// Listening Port
app.listen(port, () => {
  console.log("listening on port: ", port);
});
