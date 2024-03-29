// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide your first name.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide your last name.'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('email')
    .custom(email => {
      const user = User.findOne({ where: { email } })
      return user
        .then((user) => {
          if (user) {
            return Promise.reject('email')
          }
        })
    })
    .withMessage('User with that email already exists'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('username')
    .custom(username => {
      const user = User.findOne({ where: { username } })
      return user
        .then((user) => {
          if (user) {
            return Promise.reject('username')
          }
        })
    })
    .withMessage('User with that username already exists'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// sign-up a user
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });

    await setTokenCookie(res, user);

    return res.json({
      user: user.toSafeObject()
    });
  }
);

module.exports = router;
