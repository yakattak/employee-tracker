const mysql = require('mysql2');
const consoleTable = require('console-table');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'W&a94ixN%c2y3ho>^&3K',
  database: 'employee_db'
});

module.exports = db;