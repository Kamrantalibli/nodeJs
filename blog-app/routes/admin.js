const express = require("express");
const router = express.Router();
// const path = require("path");

const db = require("../data/db")



router.get("/blog/create" , async (req, res) => {
    try{
        const [categories, ] = await db.execute("select * from category");

        res.render("admin/blog-create", {
            title: "Add Blog",
            categories: categories
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/blog/create" , async (req ,res) => {
    const title = req.body.title;
    const aciglama = req.body.aciglama;
    const image = req.body.image;
    const hoempage = req.body.hoempage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;
    const category = req.body.category;
    // console.log(req.body); //form data => title

    try{
        await db.execute("INSERT INTO blog(baslig,aciglama,image,homePage,confirm,categoryid) VALUES (?,?,?,?,?,?)" , [title , aciglama, image, hoempage, confirm, category]);
         res.redirect("/admin/blogs");
    }
    catch(err){
        console.log(err);
    }
})

router.get("/blogs/:blogid" , async (req, res) => {
    const blogid = req.params.blogid;
    try {
        const [blogs, ] = await db.execute("select * from blog where blogid = ?" , [blogid]);
        const [categories, ] = await db.execute("select * from category")
        const blog = blogs[0]
        if (blog) {
            return res.render("admin/blog-edit" , {
                title: blog.baslig,
                blog: blog,
                categories: categories
            });
        }
        res.redirect("admin/blogs");
    } 
    catch (err) {
        console.log(err);
    }
});

router.post("/blogs/:blogid" , async (req,res)=>{
    const blogid = req.body.blogid;
    const title = req.body.title;
    const aciglama = req.body.aciglama;
    const image = req.body.image;
    const hoempage = req.body.hoempage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;
    const category = req.body.category; 

    try{
        await db.execute("UPDATE blog SET baslig=?,aciglama=?,image=?,homePage=?,confirm=?,categoryid=? WHERE blogid=?" , [title,aciglama,image,hoempage,confirm,category,blogid]);
        res.redirect("/admin/blogs");
    }
    catch(err){
        console.log(err);
    }
})

router.get("/blogs" , async (req, res) => {
    try{
        const [blogs ,] = await db.execute("select blogid,baslig,image from blog");
        res.render("admin/blog-list", {
            title: "Blog List",
            blogs: blogs
        });
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;