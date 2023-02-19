const express = require("express");
const router = express.Router();
// const path = require("path");

const db = require("../data/db");

const multer = require("multer");
const upload = multer({dest: "./public/images"});

//Blogs

router.get("/blog/delete/:blogid" , async (req,res) => {
    const blogid = req.params.blogid;

    try {
        const [blogs, ] = await db.execute("select * from blog where blogid=?",[blogid]);
        const blog = blogs[0];

        res.render("admin/blog-delete" , {
            title: "Delete blog",
            blog: blog
        });

    } catch (err) {
        console.log(err);
    }
})

router.post("/blog/delete/:blogid" , async (req,res) => {
    const blogid = req.body.blogid;
    try {
        await db.execute("delete from blog where blogid=?" , [blogid]);
        res.redirect("/admin/blogs?action=delete");
        
    } catch (err) {
        console.log(err);
    }
})

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

router.post("/blog/create" , upload.single("image") , async (req ,res) => {
    const title = req.body.title;
    const aciglama = req.body.aciglama;
    const image = req.file.filename;  //file yuklemek ucun npm multer lazimdi. Ondan sonra ise req.file yazmaliyig
    const hoempage = req.body.hoempage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;
    const category = req.body.category;
    // console.log(req.body); //form data => title

    try{
        await db.execute("INSERT INTO blog(baslig,aciglama,image,homePage,confirm,categoryid) VALUES (?,?,?,?,?,?)" , [title , aciglama, image, hoempage, confirm, category]);
         res.redirect("/admin/blogs?action=create");
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
        res.redirect("/admin/blogs?action=edit&blogid="+blogid);
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
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
        });
    }
    catch(err){
        console.log(err);
    }
});

//Categories

router.get("/categories/delete/:categoryid" , async (req,res) => {
    const categoryid = req.params.categoryid;

    try {
        const [categories, ] = await db.execute("select * from category where categoryid=?",[categoryid]);
        const category = categories[0];

        res.render("admin/category-delete" , {
            title: "Delete Category",
            category: category
        });

    } catch (err) {
        console.log(err);
    }
})

router.post("/categories/delete/:categoryid" , async (req,res) => {
    const categoryid = req.body.categoryid;
    try {
        await db.execute("delete from category where categoryid=?" , [categoryid]);
        res.redirect("/admin/categories?action=delete");
        
    } catch (err) {
        console.log(err);
    }
})

router.get("/category/create" , async (req, res) => {
    try{
        res.render("admin/category-create", {
            title: "Add Category"
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/category/create" , async (req ,res) => {
    const name = req.body.name;
    // console.log(req.body); //form data => title

    try{
        await db.execute("INSERT INTO category(name) VALUES (?)" , [name]);
         res.redirect("/admin/categories?action=create");
    }
    catch(err){
        console.log(err);
    }
})

router.get("/categories/:categoryid" , async (req, res) => {
    const categoryid = req.params.categoryid;
    try {
        const [categories, ] = await db.execute("select * from category where categoryid = ?" , [categoryid]);
        const category = categories[0]
        if (category) {
            return res.render("admin/category-edit" , {
                title: category.name,
                category: category
            });
        }
        res.redirect("admin/categories");
    } 
    catch (err) {
        console.log(err);
    }
});

router.post("/categories/:categoryid" , async (req,res)=>{
    const categoryid = req.body.categoryid;
    const name = req.body.name;

    try{
        await db.execute("UPDATE category SET name=? WHERE categoryid=?" , [name,categoryid]);
        res.redirect("/admin/categories?action=edit&categoryid="+categoryid);
    }
    catch(err){
        console.log(err);
    }
})

router.get("/categories" , async (req, res) => {
    try{
        const [categories ,] = await db.execute("select * from category");
        res.render("admin/category-list", {
            title: "Category List",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        });
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;