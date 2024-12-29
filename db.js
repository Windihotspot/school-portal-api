const mysql = require('mysql2');

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'opium934',
  database: 'school',
  port: 3308,
});

// Check if the connection is successful
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the database');
});

// Make the connection promisified
const promiseDb = db.promise();

module.exports = promiseDb;
