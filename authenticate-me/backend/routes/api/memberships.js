const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');


const validateMembershipData = [
  check('userId')
    .exists({ checkFalsy: true })
    .withMessage('userId is required'),
  check('userId')
    .custom(async (userId) => {
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return Promise.reject('userId')
      };
      return true;
    })
    .withMessage('User couldn\'t be found'),
  check('status')
    .exists({ checkFalsy: true })
    .withMessage('status is required'),
  check('status')
    .not()
    .isIn(['pending'])
    .withMessage('Cannot change a membership status to pending'),
  check('status')
    .isIn(['member', 'co-host', 'pending'])
    .withMessage('That is not a valid status'),
  handleValidationErrors
];

module.exports = { validateMembershipData }
