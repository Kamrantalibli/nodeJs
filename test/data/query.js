const db = require("./db");

exports.querySync = (query, dependency) =>
  new Promise((resolve, reject) => {
    db.query(query, dependency).then(function (result, error) {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  });
