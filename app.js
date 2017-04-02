'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let logger = require('morgan');
let app = express();

let registerCb = require('./routes/register');
let loginCb = require('./routes/login');
let profileCb = require('./routes/profile');
let port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.post('/api/register', registerCb);
app.post('/api/login', loginCb);
app.get('/api/profiles', profileCb);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
})

module.exports = app;
