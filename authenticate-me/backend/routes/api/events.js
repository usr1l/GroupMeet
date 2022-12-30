// backend/routes/api/events.js
const eventsRouter = require('express').Router();
const { Group, GroupImage, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, checkAuth, checkCohost, checkAttendance } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { inputToDate, toJSONDisplay } = require('../../utils/helpers')


const validateEventData = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters long'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('type')
    .exists({ checkFalsy: true })
    .isIn(['Online', 'In person'])
    .withMessage('Type must be \'Online\' or \'In person\''),
  check('capacity')
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .custom(price => {
      const newPrice = parseFloat(price).toFixed(2);
      const newPriceParsed = parseFloat(newPrice);
      const bool = newPriceParsed === price;
      if (!bool) {
        return Promise.reject('price');
      };
      return true;
    })
    .withMessage('Price is invalid'),
  check('startDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .custom(startDate => {
      const date = inputToDate(startDate);
      if (date < new Date()) {
        return Promise.reject('startDate')
      };
      return true;
    })
    .withMessage('Start date must be in the future, format must be YYYY-MM-DD hh:mm:ss'),
  check('endDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .custom((endDate, { req }) => {
      const startDate = inputToDate(req.body.startDate);
      const date = inputToDate(endDate);
      if (date < startDate) {
        return Promise.reject('startDate')
      };
      return true;
    })
    .withMessage('End date must be after start date, format must be YYYY-MM-DD hh:mm:ss'),
  handleValidationErrors
];


// throw event does not exist error
function eventDoesNotExist(next) {
  const err = new Error('An event with that id does not exist');
  err.status = 404;
  return next(err);
};


// add an image to an event based on the event's id
eventsRouter.post('/:eventId/images', requireAuth, async (req, res, next) => {

  const { eventId } = req.params;
  const userId = req.user.id;

  // if group does not exist throw error
  let event = await Event.findByPk(eventId);
  if (!event) {
    return eventDoesNotExist(next)
  }

  const { groupId } = event.toJSON();
  const group = await Group.findByPk(groupId);
  const { organizerId } = group.toJSON();

  // only attendee, host, co-host can add an image
  const attendanceBool = await checkAttendance(userId, eventId);
  const cohostBool = await checkCohost(userId, organizerId, groupId);

  if ((attendanceBool === false) && (cohostBool instanceof Error)) {
    const err = new Error('Must be an attendee, host, or co-host to add an image');
    err.status = 403;
    err.title = 'Forbidden';
    return next(err);
  };

  const { url, preview } = req.body;

  // change preview img
  if (preview === true) {
    const img = await EventImage.findOne({
      where: {
        [Op.and]: [{ eventId }, { preview: true }]
      }
    });

    if (img) {
      const imgJSON = img.toJSON();
      const imgId = imgJSON.id

      const currPreviewImg = await EventImage.findByPk(imgId);
      await currPreviewImg.update({
        preview: false
      });
    };
  };

  // add the new img
  const newImg = await EventImage.create({
    url,
    preview,
    eventId
  });

  let addedImg;

  if (newImg) {
    addedImg = newImg.toSafeObject();
  } else {
    addedImg = null;
  };

  return res.json(addedImg);
});


// get all events
// eventsRouter


module.exports = { validateEventData, eventsRouter }
