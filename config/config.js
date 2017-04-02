let mysql = require('mysql');

let mysqlConfig = {
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test_db'
};

let jwtSecretWord = 'BoogieMan';

let pool = mysql.createPool(mysqlConfig);

let exportsObject = {
  pool: pool,
  jwtSecretWord: jwtSecretWord
};

module.exports = exportsObject;
