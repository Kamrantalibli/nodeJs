const Blog = require("../models/blog");
const Category = require("../models/category");
const slugField = require("../helpers/slugfield");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Role = require("../models/role");


const populate = async() => {
    // await Blog.sync({ alter: true });
    // console.log("blog table was created");
    const count = await Category.count();

    if(count == 0){

        const users = await User.bulkCreate([
            {fullname: "kamran", email: "bytalibli2@gmail.com", password: await bcrypt.hash("135790", 10)},
            {fullname: "kerim", email: "kerim@gmail.com", password: await bcrypt.hash("135790", 10)},
            {fullname: "nurlan", email: "nurlan@gmail.com", password: await bcrypt.hash("135790", 10)},
            {fullname: "kenan", email: "kenan@gmail.com", password: await bcrypt.hash("135790", 10)},
            {fullname: "nihad", email: "nihad@gmail.com", password: await bcrypt.hash("135790", 10)}
        ]);

        const roles = await Role.bulkCreate([
            {rolename: "admin"},
            {rolename: "moderator"},
            {rolename: "guest"}
        ])

        await users[0].addRole(roles[0]); // admin => kamran
        
        await users[1].addRole(roles[1]); // moderator => kerim
        await users[2].addRole(roles[1]); // moderator => nurlan
        
        await users[3].addRole(roles[2]); // guest => kenan
        await users[4].addRole(roles[2]); // guest => nihad
        

        const categories = await Category.bulkCreate([
            {name: "Web Development",url: slugField("Web Development")},
            {name: "Ios Development",url: slugField("Ios Development")},
            {name: "Android Development",url: slugField("Android Development")},
        ]);

        const blogs = await Blog.bulkCreate([
            {
                baslig: "Full Stack Web Development.",
                url: slugField("Full Stack Web Development"),
                altbaslig: "Sifirdan ileri seviyye Web development : nodeJs",
                aciglama: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias totam ipsam eum temporibus libero ut, aspernatur doloremque. Dignissimos blanditiis earum quidem assumenda consectetur cumque esse possimus facere, animi doloremque?",
                image: "1.jpeg",
                homepage: true,
                confirm: true,
                userId:2
            },
            {
                baslig: "Zero to Advanced JavaScript Course",
                url: slugField("Zero to Advanced JavaScript Course"),
                altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
                aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
                image: "2-1677045413425.jpeg",
                homepage: true,
                confirm: true,
                userId:2
            },
            {
                baslig: "Zero to Advanced Phyton Course",
                url: slugField("Zero to Advanced Phyton Course"),
                altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
                aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
                image: "3.jpeg",
                homepage: true,
                confirm: true,
                userId:2
            },
            {
                baslig: "Zero to Advanced ReactJs Course",
                url: slugField("Zero to Advanced ReactJs Course"),
                altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
                aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
                image: "4.jpeg",
                homepage: true,
                confirm: true,
                userId:2
            },
            {
                baslig: "Zero to Advanced ReactJs Course",
                url: slugField("Zero to Advanced ReactJs Course"),
                altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
                aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
                image: "4.jpeg",
                homepage: true,
                confirm: true,
                userId:3
            },
            {
                baslig: "Zero to Advanced ReactJs Course",
                url: slugField("Zero to Advanced ReactJs Course"),
                altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
                aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
                image: "4.jpeg",
                homepage: true,
                confirm: true,
                userId:3
            },
            {
                baslig: "Zero to Advanced ReactJs Course",
                url: slugField("Zero to Advanced ReactJs Course"),
                altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
                aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
                image: "4.jpeg",
                homepage: true,
                confirm: true,
                userId:3
            },
            {
                baslig: "Zero to Advanced ReactJs Course",
                url: slugField("Zero to Advanced ReactJs Course"),
                altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
                aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
                image: "4.jpeg",
                homepage: true,
                confirm: true,
                userId:3
            },
            {
                baslig: "Zero to Advanced ReactJs Course",
                url: slugField("Zero to Advanced ReactJs Course"),
                altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
                aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
                image: "4.jpeg",
                homepage: true,
                confirm: true,
                userId:3
            }
        ]);


        await categories[0].addBlog(blogs[0]);
        await categories[0].addBlog(blogs[1]);

        await categories[1].addBlog(blogs[2]);
        await categories[1].addBlog(blogs[3]);

        await categories[2].addBlog(blogs[0]);
        await categories[2].addBlog(blogs[1]);

    }
    
    // await Category.sync({ alter: true });
    // console.log("category table was created");


    //  await c1.save();

     console.log("Category was added");
}

module.exports = populate;