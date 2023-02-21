const Blog = require("../models/blog");
const Category = require("../models/category");

const { Op } = require("sequelize");


exports.blogs_by_category = async (req, res) =>{
    const slug = req.params.slug;
    try{
        const blogs = await Blog.findAll({
            where: {
                confirm: true
            },
            include: {
                model: Category,
                where: {url: slug}
            },
            raw: true
        });
        const categories = await Category.findAll({raw: true});
        // console.log(blogs[0]);
        res.render("users/blogs" , {
            title: "Courses",
            categories: categories,
            blogs: blogs,
            selectedcategory: slug
        });
    }
    catch(err) {
        console.log(err);   
    }
}

exports.blog_details = async (req, res, next) => {
    // console.log(__dirname);
    // console.log(__filename);
    const slug = req.params.slug;
    // console.log(id); 
    try {
        const blog = await Blog.findOne({
            where: {
                url: slug
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
}

exports.blog_list =  async (req, res) => {
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
}

exports.index = async (req, res) => {
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
}