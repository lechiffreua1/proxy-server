let ProfilesModel = require('./../models/profiles');

function profileCallback(req, res) {
  let token = req.headers['access-token'];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  ProfilesModel.getProfiles()
    .then(function success(response) {
      let status = response.status;
      let result = response.profiles;

      res.status(status).json({
        profiles: result
      });
    },
    function error(response) {
      let err = response;

      console.error(err);
      res.sendStatus(500);
    });
}

module.exports = profileCallback;
