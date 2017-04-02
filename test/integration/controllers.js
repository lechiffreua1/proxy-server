'use strict'

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();
let token = '';

chai.use(chaiHttp);

describe('register new user', () => {
  it('it should not register user and respond with status 400', (done) => {
    let user = {
      name: 'John',
      password: '12345'
    };

    chai.request(server)
        .post('/api/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        })
  });

  it('it should not register user and respond with status 409', (done) => {
    let user = {
      name: 'Le.chiffre',
      password: '12345',
      email: 'd.marchenko@mail.ru'
    };

    chai.request(server)
        .post('/api/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        })
  });

  it('it should register new user and respond with status 200 and token', (done) => {
    let user = {
        name: "John",
        password: "12345",
        email: 'boogieman@gmail.com'
    };

    chai.request(server)
        .post('/api/register')
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
          done();
        });
  });
});

describe('login user', () => {
  it('it should respond with status 200 and return token', (done) => {
    let user = {
      password: '12345',
      email: 'd.marchenko@mail.ru'
    };

    chai.request(server)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');

          token = res.body.token;
          done();
        });
  });

  it('it should respond with status 401', (done) => {
    let user = {
      password: '12345',
      email: 'd.marchenko@ukr.net'
    };

    chai.request(server)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
  });

  it('it should respond with status 400', (done) => {
    let user = {
      password: '1234',
      email: 'd.marchenko@mail.ru'
    };

    chai.request(server)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
  });
});

describe('/GET profiles', () => {
  it('it should respond with error 401', (done) => {
    chai.request(server)
        .get('/api/profiles')
        .end((err, res) => {
            res.should.have.status(401);
          done();
        });
  });

  it('it should respond with status 200 and return profiles object', (done) => {
    chai.request(server)
        .get('/api/profiles')
        .set('Access-Token', token)
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('profiles')
          res.body.profiles.should.be.a('array')
          done();
        });
  });
});
