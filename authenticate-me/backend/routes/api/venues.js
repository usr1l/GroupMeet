// backend/routes/api/venues.js
const router = require('express').Router();
const { Group, GroupImage, User, Membership } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateVenueData = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage("Lattitude is required"),
  check('lat')
    .custom(lat => {
      if (typeof lat !== 'number' ||
        ((lat < -180) || (lat > 180))) {
        return Promise.reject('lat')
      }
      return true;
    })
    .withMessage('Latitude must be a number bwetween 180 and -180'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage("SLongitude is required"),
  check('lng')
    .custom(lng => {
      if (typeof lng !== 'number' ||
        ((lng < -180) || (lng > 180))) {
        return Promise.reject('lng')
      }
      return true;
    })
    .withMessage('Longitude must be a number bwetween 180 and -180'),
  handleValidationErrors
];

router.get('/', async (req, res) => {
  res.json('done')
})


// module.exports = router;
module.exports = validateVenueData;
