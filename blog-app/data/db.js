const config = require("../config");

//New version...
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  dialect: "mysql",
  host: config.db.host,
  define: {
    timestamps: false
  },
  storage: "./session.mysql"
});
const connect = async ()=>{
  try {
    await sequelize.authenticate();
    console.log("mysql server connected");
  } 
  catch (err) {
    console.log("Cennection Error ", err);
  }
}
connect();

module.exports = sequelize; 



// Old version...

// const mysql = require("mysql2");

// let connection = mysql.createConnection(config.db);

// connection.connect((err) => {
//   if (err) {
//     return  console.log(err);
//   }
//   console.log("mysql server conected");
// })

// module.exports = connection.promise();

// //Promise, async-await => async