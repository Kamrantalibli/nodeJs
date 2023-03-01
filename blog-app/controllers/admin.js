const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const { Op } = require("sequelize");
const sequelize = require("../data/db");
const slugField = require("../helpers/slugfield");

exports.get_blog_delete = async (req,res) => {
    const blogid = req.params.blogid;
    const userid = req.session.userid;
    const isAdmin = req.session.roles.includes("admin");


    try {
        const blog = await Blog.findOne({
           where: isAdmin ? {id: blogid} : { id: blogid, userId: userid }
        });
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
}

exports.post_blog_delete = async (req,res) => {
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
}

exports.get_category_delete = async (req,res) => {
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
}

exports.post_category_delete = async (req,res) => {
    const categoryid = req.body.categoryid;
    try {
        // await db.execute("delete from category where categoryid=?" , [categoryid]);
        await Category.destroy({
            where: {
                id: categoryid
            }
        })
        res.redirect("/admin/categories?action=delete");
        
    } catch (err) {
        console.log(err);
    }
}

exports.get_blog_create = async (req, res) => {
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
}

exports.post_blog_create = async (req ,res) => {
    const title = req.body.title;
    const altbaslig = req.body.altbaslig;
    const aciglama = req.body.aciglama;
    // const image = req.file.filename;  //file yuklemek ucun npm multer lazimdi. Ondan sonra ise req.file yazmaliyig
    const homepage = req.body.homepage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;
    const userid = req.session.userid
    const image = ""
    // console.log(req.body); //form data => title
    
    try{
        if(title == ""){
            throw new Error("Title can not be empty");
        }
        if(title.length <5 || title.length > 20){
            throw new Error("Title must be 5-20 characters")
        }
        if(aciglama == ""){
            throw new Error("Aciglama can not be empty");
        }
        if(req.file){
            image = req.file.filename;

            fs.unlink("./public/images/" + req.body.image, err => console.log(err))
        }
        // await db.execute("INSERT INTO blog(baslig,aciglama,image,homePage,confirm,categoryid,altbaslig) VALUES (?,?,?,?,?,?,?)" , [title , aciglama, image, homepage, confirm, category,altbaslig]);
        await Blog.create({
            baslig:title,
            url: slugField(title),
            altbaslig:altbaslig,
            aciglama:aciglama,
            image:image,
            homepage:homepage,
            confirm:confirm,
            userId:userid
        });
         res.redirect("/admin/blogs?action=create");
    }
    catch(err){
        let errmessage = "";

        if(err instanceof Error){
            errmessage += err.message;

            res.render("admin/blog-create", {
                title: "Add Blog",
                categories: await Category.findAll(),
                message: {text: errmessage , class: "danger"},
                values: {
                    baslig: title,
                    altbaslig: altbaslig,
                    aciglama: aciglama
                }
            });
        }
    }
}

exports.get_category_create = async (req, res) => {
    try{
        res.render("admin/category-create", {
            title: "Add Category"
        });
    }
    catch(err){
        console.log(err);
    }
}

exports.post_category_create = async (req ,res) => {
    const name = req.body.name;
    // console.log(req.body); //form data => title

    try{
        await Category.create({name: name});
         res.redirect("/admin/categories?action=create");
    }
    catch(err){
        console.log(err);
    }
}

exports.get_blog_edit = async (req, res) => {
    const blogid = req.params.blogid;
    const userid = req.session.userid;
    const isAdmin = req.session.roles.includes("admin");
    try {
        // const [blogs, ] = await db.execute("select * from blog where blogid = ?" , [blogid]);
        const blog = await Blog.findOne({
            where: isAdmin ? {id: blogid} : { id: blogid, userId: userid },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
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
        res.redirect("/admin/blogs");
    } 
    catch (err) {
        console.log(err);
    }
}

exports.post_blog_edit = async (req,res)=>{
    const blogid = req.body.blogid;
    const title = req.body.title;
    const altbaslig = req.body.altbaslig;
    const aciglama = req.body.aciglama;
    const kategoriIds = req.body.categories;
    let image = req.body.image;
    const url = req.body.url;
    const userid = req.session.userid;


    if(req.file) {  
        image = req.file.filename;

        fs.unlink("./public/images/" + req.body.image, err => {
            console.log(err);
        });
    }

    const homepage = req.body.homepage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;

    const isAdmin = req.session.roles.includes("admin");

    try{
        const blog = await Blog.findOne({
           where: isAdmin ? {id: blogid} : { id: blogid, userId: userid },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        if(blogid){
            blog.baslig = title;
            blog.url = url;
            blog.altbaslig = altbaslig;
            blog.aciglama = aciglama;
            blog.image = image;
            blog.homepage = homepage;
            blog.confirm = confirm;
            
            if (kategoriIds == undefined) {
                await blog.removeCategories(blog.categories);
            }else{
                await blog.removeCategories(blog.categories);
                const selectedCategories = await Category.findAll({
                    where: {
                        id: {
                            [Op.in]: kategoriIds
                        }
                    }
                });
                await blog.addCategories(selectedCategories);
            }

            await blog.save();
            return res.redirect("/admin/blogs?action=edit&blogid="+blogid);
        }
        res.redirect("/admin/blogs");

        // await db.execute("UPDATE blog SET baslig=?,altbaslig=?,aciglama=?,image=?,homePage=?,confirm=?,categoryid=? WHERE blogid=?" , [title,altbaslig,aciglama,image,hoempage,confirm,category,blogid]);
    }
    catch(err){
        console.log(err);
    }
}

exports.get_category_edit = async (req, res) => {
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
        const blogs = await category.getBlogs();
        const countBlog = await category.countBlogs();
    
        if (category) {
            return res.render("admin/category-edit" , {
                title: category.dataValues.name,
                category: category.dataValues,
                blogs: blogs,
                countBlog: countBlog
            });
        }
        res.redirect("admin/categories");
    } 
    catch (err) {
        console.log(err);
    }
}

exports.get_category_remove = async (req,res) => {
    const blogid = req.body.blogid;
    const categoryid = req.body.categoryid;

    await sequelize.query(`delete from blogCategories where blogId=${blogid} and categoryId=${categoryid}`);
    res.redirect("/admin/categories/" + categoryid);
}

exports.post_category_edit = async (req,res)=>{
    const categoryid = req.body.categoryid;
    const name = req.body.name;

    try{
        await Category.update({name: name},{
            where: {
                id: categoryid 
            }
        })
        return res.redirect("/admin/categories?action=edit&categoryid="+categoryid);
        // await db.execute("UPDATE category SET name=? WHERE categoryid=?" , [name,categoryid]);
    }
    catch(err){
        console.log(err);
    }
}

exports.get_blogs = async (req, res) => {
    const userid = req.session.userid;
    const isModerator = req.session.roles.includes("moderator");
    const isAdmin = req.session.roles.includes("admin");
    try{
        // const [blogs ,] = await db.execute("select blogid,baslig,altbaslig,image from blog");
        const blogs = await Blog.findAll({
             attributes: ["id","baslig","altbaslig","image"],
             include: {
                model: Category,
                attributes:["name"] //BU yazilisda bloglarla category cedvelini birlesdirir ve categorynin sadece name hissesini gotururuk
             },
             where: isModerator && !isAdmin ? { userId: userid } : null
            });
        // console.log(blogs); 
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
}

exports.get_categories = async (req, res) => {
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
}

exports.get_roles = async (req, res) => {
    try{
        const roles = await Role.findAll({
            attributes: {
                // select count(user.id) as user_count
                include: ['role.id','role.rolename',[sequelize.fn('COUNT' , sequelize.col('users.id')), 'user_count']]
            },
            include: [
                { model: User, attributes: ['id'] }
            ],
            group: ['role.id'],
            raw: true,
            includeIgnoreAttributes: false
        });
        res.render("admin/role-list", {
            title: "Role List",
            roles: roles
        });
    }
    catch(err){
        console.log(err);
    }
}

exports.get_role_edit = async (req, res) => {
    const roleid = req.params.roleid;
    try{
        const role = await Role.findByPk(roleid);
        const users = await role.getUsers();

        if(role) {
            return res.render("admin/role-edit", {
                title:role.rolename,
                role: role,
                users: users
            })
        }
        res.redirect("admin/roles");
    }
    catch(err){
        console.log(err);
    }
}

exports.post_role_edit = async (req, res) => {
    const roleid = req.body.roleid;
    const rolename = req.body.rolename;
    try{
        await Role.update({rolename: rolename},{
            where: {
                id: roleid
            }
        })
        return res.redirect("/admin/roles");
    }
    catch(err){
        console.log(err);
    }
}

exports.post_roles_remove = async (req, res) => {
    const roleid = req.body.roleid;
    const userid = req.body.userid;
    try{
        await sequelize.query(`delete from userRoles where userId=${userid} and  roleId=${roleid}`);
        return res.redirect("/admin/roles/" + roleid);
    }
    catch(err){
        console.log(err);
    }
}

exports.get_user = async (req,res) => {
    try {
        const users = await User.findAll({
            attributes: ["id" , "fullname" , "email"],
            include: {
                model: Role,
                attributes: ["rolename"]
            }
        });

        res.render("admin/user-list" , {
            title: "User List",
            users: users
        });
    } 
    catch (err) {
        console.log(err);    
    }
}

exports.get_user_edit = async (req,res) => {
    const userid = req.params.userid;
    try {
        const user = await User.findOne({
            where: {id: userid},
            include: { model: Role , attributes: ["id"] }
        });

        const roles = await Role.findAll();

        res.render("admin/user-edit" , {
            title: "User Edit",
            user: user,
            roles: roles
        });
    } 
    catch (err) {
        console.log(err);    
    }
}

exports.post_user_edit = async (req,res) => {
    const userid = req.body.userid;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const roleIds = req.body.roles

    // console.log(req.body);
    try {
        const user = await User.findOne({
            where: {id: userid},
            include: { model: Role , attributes: ["id"] }
        });

        if (user) {
            user.fullname = fullname;
            user.email = email;

            if (roleIds == undefined) {
                await user.removeRoles(user.roles);
            }else{
                await user.removeRoles(user.roles);
                const selectedRoles = await Role.findAll({
                    where: {
                        id: {
                            [Op.in]: roleIds 
                        }
                    }
                });
                await user.addRoles(selectedRoles);
            }

            await user.save();
            return res.redirect("/admin/users");
        }
        return res.redirect("/admin/users");
    } 
    catch (err) {
        console.log(err);    
    }
}