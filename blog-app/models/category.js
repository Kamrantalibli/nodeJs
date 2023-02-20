const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define("category",{
    categoryid:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    }
},
{
    timestamps: false
});

const sync = async() => {
    await Category.sync({ alter: true });
    console.log("category table was created");

    const count = await Category.count();

    if(count == 0){

        // const c1 = await Category.create({
        //     name:"Ios development"
        // });

        await Category.bulkCreate([
            {name: "Web Development"},
            {name: "Ios Development"},
            {name: "Android Development"},
        ]);
    }

    //  await c1.save();

     console.log("Category was added");
}
sync()

module.exports = Category