const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const { User } = require('../../db/models');


const validateAttendanceData = [
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
    .withMessage('Cannot change attendance status to pending'),
  check('status')
    .isIn(['member', 'attending', 'pending', 'waitlist'])
    .withMessage('That is not a valid status'),
  handleValidationErrors
];

module.exports = { validateAttendanceData };
