// backend/routes/api/venues.js
const venuesRouter = require('express').Router();
const { Group, Venue } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, checkCohost } = require('../../utils/auth');
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




// throw group does not exist error
function venueDoesNotExist(next) {
  const err = new Error('Venue could not be found');
  err.status = 404;
  return next(err);
};


// edit a venue
venuesRouter.put('/:venueId', requireAuth, async (req, res, next) => {

  const { venueId } = req.params;
  const venue = await Venue.findByPk(venueId);


  // check if venue exists
  if (!venue) {
    venueDoesNotExist(next)
  };

  const userId = req.user.id;
  const { groupId } = venue;

  const group = await Group.findByPk(groupId);
  const { organizerId } = group;

  // check user auth
  const cohostBool = await checkCohost(userId, organizerId, groupId)

  if (cohostBool instanceof Error) {
    return next(cohostBool);
  };

  // look for errors in accepted values
  const { address, city, state, lat, lng } = req.body;

  const errors = {};

  if (lat) {
    if (typeof lat !== 'number' ||
      ((lat < -180) || (lat > 180))) {
      errors.lat = 'Lattitude must be a number bwetween 180 and -180'
    }
  };

  if (lng) {
    if (typeof lng !== 'number' ||
      ((lng < -180) || (lng > 180))) {
      errors.lng = 'Longitude must be a number bwetween 180 and -180'
    }
  };

  if (Object.keys(errors).length > 0) {
    const err = new Error('Validation error');
    err.status = 400;
    err.errors = errors;
    next(err);
  };

  //update venue
  venue.set({
    "address": address ? address : venue.address,
    "city": city ? city : venue.city,
    "state": state ? state : venue.state,
    "lat": lat ? lat : venue.lat,
    "lng": lng ? lng : venue.lng,
  })

  await venue.save();

  const updatedVenue = await Venue.findByPk(venueId)

  return res.json(updatedVenue)

});


// module.exports = router;
module.exports = { validateVenueData, venuesRouter, venueDoesNotExist }
