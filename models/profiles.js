let async = require('async');
let pool = require('./../config/config').pool;

let ProfilesModel = {
  getProfiles: getProfilesFunc
};

function getProfilesFunc(callback) {
  return new Promise((resolve, reject) => {
    async.waterfall([
      getConnection,
      queryProfiles
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

function queryProfiles(connection, queryProfilesCb) {
  connection.query(`SELECT id, name, email FROM test_db.profiles`, (err, result) => {
    connection.release();

    if (err) {
      queryProfilesCb(err);
    } else {
      let resolveObject = {
        status: 200,
        profiles: result
      };
      queryProfilesCb(null, resolveObject);
    }
  });
}

module.exports = ProfilesModel;
