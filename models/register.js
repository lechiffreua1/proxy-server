let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let async = require('async');
let secretWord = require('./../config/config').jwtSecretWord;
let pool = require('./../config/config').pool;

let RegisterModel = {
  registerUser: registerUserFunc
};

function registerUserFunc(name, password, email) {
  return new Promise((resolve, reject) => {
    async.waterfall([
      getConnection,
      async.apply(registerQuery, email),
      generateSalt,
      async.apply(hashPassword, password),
      async.apply(insertQuery, email, name),
      generateToken
    ], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
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

function registerQuery(email, connection, registerQueryCb) {
  connection.query(`SELECT email FROM test_db.profiles WHERE email=?`, [email], (err, result) => {
    if (err) {
      registerQueryCb(err);
    } else {
      if (result.length !== 0) {
        registerQueryCb({errorStatus: 409});
      } else {
        registerQueryCb(null, connection);
      }
    }
  });
}

function generateSalt(connection, generateSaltCb) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      generateSaltCb(err);
    } else {
      generateSaltCb(null, salt, connection);
    }
  });
}

function hashPassword(password, salt, connection, hashPasswordCb) {
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      hashPasswordCb(err);
    } else {
      hashPasswordCb(null, hash, connection);
    }
  });
}

function insertQuery(email, name, hash, connection, insertQueryCb) {
  let insertObject = {
    email: email,
    password: hash,
    name: name
  };
  connection.query(`INSERT INTO test_db.profiles SET ?`, insertObject, (err, response) => {
    if (err) {
      insertQueryCb(err);
    } else {
      insertQueryCb(null, name, email);
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

module.exports = RegisterModel;
