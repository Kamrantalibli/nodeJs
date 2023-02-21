const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog",{
    baslig: {
        type: DataTypes.STRING,
        allowNull:false
    },
    url: {
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
    }
},
{
    timestamps: true
});

module.exports = Blog