let LoginModel = require('./../models/login');

function loginCallback(req, res) {
  let password = req.body.password;
  let email = req.body.email;

  LoginModel.loginUser(email, password)
    .then(function success(response) {
      let status = response.status;
      let token = response.token;

      res.status(status).json({
        token: token
      });
    },
    function error(response) {
      let err = response;
      let errorStatus = response.errorStatus;

      if (errorStatus) {
        res.sendStatus(errorStatus);
      } else {
        throw err;
      }
    });
}

module.exports = loginCallback;
