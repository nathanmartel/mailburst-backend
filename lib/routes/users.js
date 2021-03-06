const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');
const jwtDecode = require('jwt-decode');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const handleAuthorization = (res, user) => {
  const token = user.authToken();
  res.cookie('token', token, {
    maxAge: ONE_DAY_IN_MS,
    httpOnly: true
  });
  const expiresAt = jwtDecode(token).exp;
  const userInfo = user.toJSON(); 
  res.send({ token, userInfo, expiresAt });
};

module.exports = Router()

  // Creates a user and sends authorization
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => handleAuthorization(res, user))
      .catch(next);
  })

  // Gets a specific user and sends authorization
  .post('/login', (req, res, next) => {
    User
      .authorize(req.body)
      .then(user => handleAuthorization(res, user))
      .catch(next);
  })

  // Gets all users
  .get('/', ensureAuth, (req, res, next) => {
    User
      .find()
      .then(users => res.send(users))
      .catch(next);
  })

  // Updates a specific user
  .patch('/:id', ensureAuth, (req, res, next) => {
    User
      .findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(user => res.send(user))
      .catch(next);
  })

  // Gets a specific user
  .get('/:id', ensureAuth, (req, res, next) => {
    User
      .findById(req.params.id)
      .then(user => res.send(user))
      .catch(next);
  })

  // Gets a user based on supplied token
  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  });
