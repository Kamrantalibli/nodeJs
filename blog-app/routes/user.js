const express = require("express");
const router =  express.Router();
// const path = require("path");

const data = {
    title: "Popular Courses",
    categories: ["Web Development" , "Programming" , "Mobil Development" , "Data Analysis"],
    blogs: [
        {
            blogid: 1,
            baslig: "Full Stack Web Development",
            aciglama: "Sıfırdan ileri seviyeye 'Web Geliştirme': Html,Css,Sass, Flexbox,Grid,Bootstrap,Javascript,Angular,Firebase,Asp.Net Core",
            image: "1.jpeg",
            homePage: true,
            confirm: true
        },
        {
            blogid: 2,
            baslig: "Python programming",
            aciglama: "Sıfırdan ileri seviyeye Python Dersleri . Veritabani , Veri Analzi, Bot Yazimi,Web Gelistirme(Django)",
            image: "2.jpeg",
            homePage: true,
            confirm: false
        },
        {
            blogid: 3,
            baslig: "Zero to Advanced JavaScript Course",
            aciglama: "Modern javascript dersleri ile (ES6 & ES7+) Nodejs, Angular, React ve VueJs için sağlam bir temel oluşturun.",
            image: "3.jpeg",
            homePage: false,
            confirm: true
        }
    ]
};


router.use("/blogs/:blogid" , (req, res, next) => {
    // console.log(__dirname);
    // console.log(__filename);
    res.render("users/blog-details");
});

router.use("/blogs" , (req, res) => {
    res.render("users/blogs" , data);
});

router.use("/" , (req, res) => {
    res.render("users/index" , data);
});

module.exports = router;