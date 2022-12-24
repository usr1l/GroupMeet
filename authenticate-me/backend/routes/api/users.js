// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
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
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
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

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      const err = new Error('User already exists');
      err.status = 403;
      err.errors = { "email": "User with that email already exists" }
      throw err;
    };

    const user = await User.signup({ firstName, lastName, email, username, password });

    await setTokenCookie(res, user);

    return res.json({
      user: user.toSafeObject()
    });
  }
);

module.exports = router;
