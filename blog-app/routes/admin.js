const express = require("express");
const router = express.Router();
// const path = require("path");
const fs = require("fs");

// const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");

const Blog = require("../models/blog");
const Category = require("../models/category");

//Blogs

router.get("/blog/delete/:blogid" , async (req,res) => {
    const blogid = req.params.blogid;

    try {
        const blog = await Blog.findByPk(blogid);
        if (blog) {
            return res.render("admin/blog-delete" , {
                title: "Delete blog",
                blog: blog
            });
        }
        res.redirect("/admin/blogs");


    } catch (err) {
        console.log(err);
    }
})

router.post("/blog/delete/:blogid" , async (req,res) => {
    const blogid = req.body.blogid;
    try {
        // await db.execute("delete from blog where blogid=?" , [blogid]);
        const blog = await Blog.findByPk(blogid);
        if (blog) {
            await blog.destroy();
            return res.redirect("/admin/blogs?action=delete");
        }
        res.redirect("/admin/blogs");

        
    } catch (err) {
        console.log(err);
    }
})

router.get("/blog/create" , async (req, res) => {
    try{
        // const [categories, ] = await db.execute("select * from category");
        const categories = await Category.findAll();

        res.render("admin/blog-create", {
            title: "Add Blog",
            categories: categories
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/blog/create" , imageUpload.upload.single("image") , async (req ,res) => {
    const title = req.body.title;
    const altbaslig = req.body.altbaslig;
    const aciglama = req.body.aciglama;
    const image = req.file.filename;  //file yuklemek ucun npm multer lazimdi. Ondan sonra ise req.file yazmaliyig
    const homepage = req.body.homepage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;
    const category = req.body.category;
    // console.log(req.body); //form data => title

    try{
        // await db.execute("INSERT INTO blog(baslig,aciglama,image,homePage,confirm,categoryid,altbaslig) VALUES (?,?,?,?,?,?,?)" , [title , aciglama, image, homepage, confirm, category,altbaslig]);
        await Blog.create({
            baslig:title,
            altbaslig:altbaslig,
            aciglama:aciglama,
            image:image,
            homepage:homepage,
            confirm:confirm,
            categoryid:category
        });
         res.redirect("/admin/blogs?action=create");
    }
    catch(err){
        console.log(err);
    }
})

router.get("/blogs/:blogid" , async (req, res) => {
    const blogid = req.params.blogid;
    try {
        // const [blogs, ] = await db.execute("select * from blog where blogid = ?" , [blogid]);
        const blog = await Blog.findByPk(blogid);
        // const [categories, ] = await db.execute("select * from category")
        const categories = await Category.findAll();
        // const blog = blogs[0]
        if (blog) {
            return res.render("admin/blog-edit" , {
                title: blog.dataValues.baslig,
                blog: blog.dataValues,
                categories: categories
            });
        }
        res.redirect("admin/blogs");
    } 
    catch (err) {
        console.log(err);
    }
});

router.post("/blogs/:blogid" , imageUpload.upload.single("image") , async (req,res)=>{
    const blogid = req.body.blogid;
    const title = req.body.title;
    const altbaslig = req.body.altbaslig;
    const aciglama = req.body.aciglama;
    let image = req.body.image;

    if(req.file) {
        image = req.file.filename;

        fs.unlink("./public/images/" + req.body.image, err => {
            console.log(err);
        });
    }

    const homepage = req.body.homepage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;
    const category = req.body.category; 

    try{
        const blog = await Blog.findByPk(blogid);
        if(blogid){
            blog.baslig = title;
            blog.altbaslig = altbaslig;
            blog.aciglama = aciglama;
            blog.image = image;
            blog.homepage = homepage;
            blog.confirm = confirm;
            blog.categoryid = category;

            await blog.save();
            return res.redirect("/admin/blogs?action=edit&blogid="+blogid);
        }
        res.redirect("/admin/blogs");

        // await db.execute("UPDATE blog SET baslig=?,altbaslig=?,aciglama=?,image=?,homePage=?,confirm=?,categoryid=? WHERE blogid=?" , [title,altbaslig,aciglama,image,hoempage,confirm,category,blogid]);
    }
    catch(err){
        console.log(err);
    }
})

router.get("/blogs" , async (req, res) => {
    try{
        // const [blogs ,] = await db.execute("select blogid,baslig,altbaslig,image from blog");
        const blogs = await Blog.findAll({ attributes: ["blogid","baslig","altbaslig","image"] });
        console.log(blogs); 
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
        // const [categories, ] = await db.execute("select * from category where categoryid=?",[categoryid]);
        // const category = categories[0];
        const category = await Category.findByPk(categoryid)
        if (category) {
            return res.render("admin/category-delete" , {
                title: "Delete Category",
                category: category
            });
        }

    } catch (err) {
        console.log(err);
    }
})

router.post("/categories/delete/:categoryid" , async (req,res) => {
    const categoryid = req.body.categoryid;
    try {
        // await db.execute("delete from category where categoryid=?" , [categoryid]);
        await Category.destroy({
            where: {
                categoryid: categoryid
            }
        })
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
        await Category.create({name: name});
         res.redirect("/admin/categories?action=create");
    }
    catch(err){
        console.log(err);
    }
})

router.get("/categories/:categoryid" , async (req, res) => {
    const categoryid = req.params.categoryid;
    try {
        // const [categories, ] = await db.execute("select * from category where categoryid = ?" , [categoryid]);
        // const category = await Category.findAll({
        //     where: {
        //         categoryid: categoryid
        //     }
        // })
        // const category = categories[0]

        const category = await Category.findByPk(categoryid);

        if (category) {
            return res.render("admin/category-edit" , {
                title: category.dataValues.name,
                category: category.dataValues
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
        await Category.update({name: name},{
            where: {
                categoryid: categoryid 
            }
        })
        return res.redirect("/admin/categories?action=edit&categoryid="+categoryid);
        // await db.execute("UPDATE category SET name=? WHERE categoryid=?" , [name,categoryid]);
    }
    catch(err){
        console.log(err);
    }
})

router.get("/categories" , async (req, res) => {
    try{
        const categories = await Category.findAll();
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