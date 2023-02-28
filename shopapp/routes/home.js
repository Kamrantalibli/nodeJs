const express = require("express");
const router = express.Router(); 

const products = [
    { id: 1, name: "iphone 12", price: 20000 },
    { id: 2, name: "iphone 13", price: 30000 },
    { id: 3, name: "iphone 14", price: 40000 },
];

router.get("/", (req, res) => {
    res.send(products[0]);
});

module.exports = router;