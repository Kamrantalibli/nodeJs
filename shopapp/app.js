const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const products = require("./routes/products");
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
app.use("/" , home);

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
