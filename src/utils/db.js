const mysql = require('mysql')

require('dotenv').config();

let connection = mysql.createConnection (
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  }
);

connection.connect();

// basic promise wrapper

connection.queryPromise = (sql, params) => {
  return new Promise( (resolve, reject) => {
    connection.query(sql, params, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};

// go farther and process the results of the promise and return the results 

connection.querySync = async (sql, params) => {
  let promise = new Promise ( (resolve, reject) => {
    console.log("Executing query: ", sql);
    connection.query(sql, params, (err, results) => {
      if (err) {
        console.log("Rejecting");
        return reject(err);
      } else {
        console.log("Resolving");
        return resolve(results);
      }
    })
  })
  let results = await promise.then ( (results) => {
    console.log("Results ", results);
    return results;
  }) .catch( (err) => {
    throw err;
  })
  return results;
}

// below is a test to see if connection was made
connection.query("select now()", (err, rows) => {
  if(err) {
    console.log("Connection unsuccessful", err);
  } else {
    console.log("Connection successful", rows)
  }
});

module.exports = connection;
