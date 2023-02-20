const express = require("express");
const router =  express.Router();
// const path = require("path");

// const db = require("../data/db");

const Blog = require("../models/blog");
const Category = require("../models/category");

const { Op } = require("sequelize");

router.use("/blogs/category/:categoryid" ,async (req, res) =>{
    const id = req.params.categoryid;
    try{
        const blogs = await Blog.findAll({
            where: {
                categoryid: id,
                confirm: true
            },
            raw: true
        });
        const categories = await Category.findAll({raw: true});
        // console.log(blogs[0]);
        res.render("users/blogs" , {
            title: "Courses",
            categories: categories,
            blogs: blogs,
            selectedcategory: id
        });
    }
    catch(err) {
        console.log(err);   
    }
} )

router.use("/blogs/:blogid" , async (req, res, next) => {
    // console.log(__dirname);
    // console.log(__filename);
    const id = req.params.blogid;
    // console.log(id); 
    try {
        const blog = await Blog.findOne({
            where: {
                blogid: id
            },
            raw: true
        });
        // console.log(blogs[0]);

        // const blog = blogs[0];

        if (blog) {
            return  res.render("users/blog-details" , {
                    title: blog.baslig,
                    blog: blog
                    });
        }
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});

router.use("/blogs" , async (req, res) => {
    try{
        const blogs = await Blog.findAll({
            where: {
                confirm: {
                    [Op.eq]: true // operator yardimi ile confirm=1 yazirig
                }
            },
            raw: true
        })
        const categories = await Category.findAll({raw: true});
        // console.log(blogs[0]);
        res.render("users/blogs" , {
            title: "All Courses",
            categories: categories,
            blogs: blogs,
            selectedcategory: null
        });
    }
    catch(err) {
        console.log(err);
    }
});

router.use("/" , async (req, res) => {
    try{
        const blogs = await Blog.findAll({
            where: {
                [Op.and]: [
                    {homepage: true},
                    {confirm: true}
                ]
            },
            raw: true
        });
        const categories = await Category.findAll({ raw: true });
        // console.log(blogs[0]);
        res.render("users/index" , {
            title: "Popular Courses",
            categories: categories,
            blogs: blogs,
            selectedcategory: null
        });
    }
    catch(err) {
        console.log(err);
    } 
});

module.exports = router;