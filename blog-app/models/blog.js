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
    timestamps: true,
    validate: {
        checkedValidConfirm(){  //burada value yazilmir cunki datalar ile eyni seviyyededi ve this ile yazilir 
            if(this.homepage && !this.confirm){
                throw new Error("The blog you have taken to the homepage has not been confirm.");
            }
        }
    }
});

module.exports = Blog