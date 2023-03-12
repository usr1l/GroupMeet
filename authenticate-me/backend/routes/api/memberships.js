const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { User, Membership } = require('../../db/models');

const membershipRouter = express.Router();

const validateMembershipData = [
  check('memberId')
    .exists({ checkFalsy: true })
    .withMessage('memberId is required'),
  check('memberId')
    .custom(async (userId) => {
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return Promise.reject('memberId')
      };
      return true;
    })
    .withMessage('User couldn\'t be found'),
  check('status')
    .exists({ checkFalsy: true })
    .withMessage('status is required'),
  check('status')
    .not()
    .isIn([ 'pending' ])
    .withMessage('Cannot change a membership status to pending'),
  check('status')
    .isIn([ 'member', 'co-host', 'pending' ])
    .withMessage('That is not a valid status'),
  handleValidationErrors
];

const validateMembershipDataDelete = [
  check('memberId')
    .exists({ checkFalsy: true })
    .withMessage('memberId is required'),
  handleValidationErrors
]

membershipRouter.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const memberships = await Membership.findAll({
    where: {
      userId
    }
  });

  res.status = 200;
  return res.json(memberships);
});



module.exports = { validateMembershipData, validateMembershipDataDelete, membershipRouter }
