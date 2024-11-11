const mysql = require('mysql2');

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'opium934', 
  database: 'school',
});

// Make the connection promisified
const promiseDb = db.promise();

module.exports = promiseDb;
