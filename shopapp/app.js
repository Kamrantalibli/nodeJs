const express = require("express");
const app = express();
const port = 3000;

// http methods: get, post, put, delete

const products = [
    { id: 1 , name: "Iphone 12", price: 2000 },
    { id: 2 , name: "Iphone 13", price: 3000 },
    { id: 3 , name: "Iphone 14", price: 4000 }
];


app.get("/" , (req,res) => {
    res.json(products[0]);
});

app.get("/api/products" , (req,res) => {
    res.json(products)
});

app.get("/api/products/:id" , (req,res) => {
    console.log(req.params);
    console.log(req.query);

    const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        res.status(404).send("Product is not defined");
    }
    res.json(product);
});

app.listen(port , () => {
    console.log("Listening on port: " + port);
});