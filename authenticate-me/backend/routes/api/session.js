// backend/routes/api/session.js
const express = require('express');

const { jwtConfig } = require('../../config');
const jwt = require('jsonwebtoken');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { secret } = jwtConfig;

const router = express.Router();

// validate keys and login
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// login a user
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = ['The provided credentials were invalid.'];
      return next(err);
    }

    await setTokenCookie(res, user);

    return res.json({
      user: user.toSafeObject()
    });
  }
);

// logout a usr
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;

    console.log('REQ-------', req)
    console.log('USER-------', user)
    {

      const { token } = req.cookies
      const headerToken = req.headers['xsrf-token']
      console.log('token-----', headerToken)
      console.log('cookie-----', token)
      const [header, payload, secretKey] = token.split('.')
      console.log('SCRETKEY-----', secretKey)
      console.log('PAYLOAD-----', payload)
      const payload2 = jwt.decode(token)
      console.log('PAYLOAD2', payload2)
      const verify = jwt.verify(token, secret)
      console.log('VERYIFY-----', verify)
    }


    // console.log('token', xsrftoken)
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({ user: null });
  }
);

module.exports = router;
