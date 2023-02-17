const express = require("express");
const router =  express.Router();
// const path = require("path");

const db = require("../data/db");

router.use("/blogs/category/:categoryid" ,async (req, res) =>{
    const id = req.params.categoryid;
    try{
        const [blogs, ] = await db.execute("select * from blog where categoryid=?" , [id]);
        const categories = await db.execute("select * from category");
        // console.log(blogs[0]);
        res.render("users/blogs" , {
            title: "All Courses",
            categories: categories[0],
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
        const [blogs, ] = await db.execute("select * from blog where blogid=?" , [id]);
        console.log(blogs[0]);

        const blog = blogs[0];

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
        const blogs = await db.execute("select * from blog where confirm=1");
        const categories = await db.execute("select * from category");
        // console.log(blogs[0]);
        res.render("users/blogs" , {
            title: "All Courses",
            categories: categories[0],
            blogs: blogs[0],
            selectedcategory: null
        });
    }
    catch(err) {
        console.log(err);
    }
});

router.use("/" , async (req, res) => {
    try{
        const blogs = await db.execute("select * from blog where confirm=1 and homePage=1");
        const categories = await db.execute("select * from category");
        // console.log(blogs[0]);
        res.render("users/index" , {
            title: "Popular Courses",
            categories: categories[0],
            blogs: blogs[0],
            selectedcategory: null
        });
    }
    catch(err) {
        console.log(err);
    } 
});

module.exports = router;