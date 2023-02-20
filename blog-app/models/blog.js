const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog",{
    blogid:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    baslig: {
        type: DataTypes.STRING,
        allowNull:false
    },
    altbaslig: {
        type: DataTypes.STRING,
        allowNull: false
    },
    aciglama: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    homepage: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    confirm:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    categoryid:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
});


const sync = async() => {
    await Blog.sync({ alter: true });
    console.log("blog table was created");

    const count = await Blog.count();

    if(count == 0){
        await Blog.create({
            baslig: "Full Stack Web Development.",
            altbaslig: "Sifirdan ileri seviyye Web development : nodeJs",
            aciglama: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias totam ipsam eum temporibus libero ut, aspernatur doloremque. Dignissimos blanditiis earum quidem assumenda consectetur cumque esse possimus facere, animi doloremque?",
            image: "1.jpeg",
            homepage: true,
            confirm: true,
            categoryid: 1
        });
        await Blog.create({
            baslig: "Zero to Advanced JavaScript Course",
            altbaslig: "Sifirdan ileri seviyye JavaScript Development : nodeJs, ReactJs",
            aciglama: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel est harum eos non blanditiis id nesciunt, rerum deleniti quia veniam cumque vitae quo, repellendus dolores optio labore expedita animi. Voluptatum consectetur neque ratione sit accusantium repellat aliquam libero? Labore, libero?",
            image: "2.jpeg",
            homepage: true,
            confirm: true,
            categoryid: 1
        });
    }
}
sync()

module.exports = Blog