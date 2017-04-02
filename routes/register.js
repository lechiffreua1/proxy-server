let RegisterModel = require('./../models/register');

function registerCallback(req, res) {
  let name = req.body.name;
  let password = req.body.password;
  let email = req.body.email;

  if (!password || !email) {
    res.sendStatus(400);
    return;
  }

  RegisterModel.registerUser(name, password, email)
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

module.exports = registerCallback;
