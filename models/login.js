let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let async = require('async');
let secretWord = require('./../config/config').jwtSecretWord;
let pool = require('./../config/config').pool;

let LoginModel = {
  loginUser: loginUserFunc
};

function loginUserFunc(email, password) {
  return new Promise((resolve, reject) => {
    async.waterfall([
      getConnection,
      async.apply(performQuery, email),
      async.apply(comparePassword, password),
      generateToken
    ], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  })
}

function getConnection(connectionCb) {
  pool.getConnection((err, connection) => {
    if (err) {
      connectionCb(err);
    } else {
      connectionCb(null, connection);
    }
  });
}

function performQuery(email, connection, performQueryCb) {
  connection.query(`SELECT email, password, name FROM test_db.profiles WHERE email=?`, [email],(err, result) => {
    connection.release();

    if (err) {
      performQueryCb(err);
    } else {

      if (result.length) {
        let dbPassword = result[0].password;
        let dbName = result[0].name;
        let dbEmail = result[0].email;

        performQueryCb(null, dbPassword, dbName, dbEmail);
      } else {
        performQueryCb({errorStatus: 401});
      }
    }
  });
}

function comparePassword(password, dbPassword, dbName, dbEmail, comparePasswordCb) {
  bcrypt.compare(password, dbPassword, (err, response) => {
    if (err) {
      comparePasswordCb(err);
    } else {
      if (response) {
        comparePasswordCb(null, dbName, dbEmail);
      } else {
        comparePasswordCb({errorStatus: 400});
      }
    }
  });
}

function generateToken(dbName, dbEmail, generateTokenCb) {
  jwt.sign({ dbName, dbEmail }, secretWord, {}, function(err, token) {
    if (err) {
      generateTokenCb(err);
    } else {
      let resolveObject = {
        status: 200,
        token: token
      };

      generateTokenCb(null, resolveObject);
    }
  })
}

module.exports = LoginModel;
