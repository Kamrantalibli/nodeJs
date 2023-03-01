const config = require("../config");
const mysql = require("mysql2");

let connection = mysql.createConnection(config.db);

connection.connect((err) => {
    if (err) {
        return console.log(err);
    }
    console.log("mysql server connected.");
});

module.exports = connection.promise();