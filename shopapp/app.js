const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const mongoose = require("mongoose");

const products = require("./routes/products");
const categories = require("./routes/categories");
const users = require("./routes/users");
const home = require("./routes/home");

app.use(express.json());
// http methods: get, post, put, delete

// app.use((req,res,next) => {
//     res.setHeader("Access-Control-Allow-Origin" , "*");
//     res.setHeader("Access-Control-Allow-Methods" , "GET");
//     next();
// })

app.use(cors({origin: "*", methods:["GET"]}))

app.use("/api/products" ,products);
app.use("/api/categories" ,categories);
app.use("/api/users" ,users);
app.use("/" , home);

const username = "kamrantalibli";
const password = "123321";
const database = "shopdb";

(async () => {
try {
  await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.4szcvle.mongodb.net/${database}?retryWrites=true&w=majority`)
  console.log("mongodb is connected");
} catch (err) {
  console.log(err);
}
})();


app.listen(port, () => {
  console.log("Listening on port: " + port);
});
