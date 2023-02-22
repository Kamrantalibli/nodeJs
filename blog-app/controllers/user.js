const Blog = require("../models/blog");
const Category = require("../models/category");

const { Op } = require("sequelize");


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
    const size = 3;
    const { page = 0 } = req.query;
    const slug = req.params.slug;

    try{
        const { rows , count } = await Blog.findAndCountAll({
            where: {
                confirm: {
                    [Op.eq]: true // operator yardimi ile confirm=1 yazirig
                }
            },
            raw: true,
            include: slug ? {model: Category, where: {url: slug}} : null,
            limit: size,
            offset: page * size
        })
        const categories = await Category.findAll({raw: true});
        // console.log(blogs[0]);
        res.render("users/blogs" , {
            title: "All Courses",
            categories: categories,
            blogs: rows,
            totalItems: count,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            selectedcategory: slug
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.index = async (req, res) => {
    console.log(req.cookies);
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