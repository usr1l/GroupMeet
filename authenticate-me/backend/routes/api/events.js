// backend/routes/api/events.js
const eventsRouter = require('express').Router();
const { Group, GroupImage, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const { Op, Validator } = require('sequelize');
const { requireAuth, checkAuth, checkCohost, checkAttendance } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { inputToDate, toJSONDisplay, getDisplayDate } = require('../../utils/helpers');
const { venueDoesNotExist } = require('./venues');
const attendance = require('../../db/models/attendance');
const { validateAttendanceData } = require('./attendances');


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
    .withMessage('Capacity must be a positive integer'),
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
    .isLength({ min: 19, max: 19 })
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
    .isLength({ min: 19, max: 19 })
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


// get the count of members of a group
async function getNumAttendees(eventId) {
  const numAttendees = await Attendance.count({
    where: {
      eventId,
      status: { [Op.in]: ['member', 'attending'] }
    }
  });
  return numAttendees;
};


// map all events
async function getEvents(events) {
  // map out the groups into JSON objects
  const eventsArr = events.map(event => event.toJSON());
  for (let event of eventsArr) {
    // manipulate each json object
    const { venueId, groupId, id } = event;
    event.numAttending = await getNumAttendees(id);
    const venue = await Venue.findOne({
      attributes: {
        exclude: ['address', 'lng', 'lat', 'groupId']
      },
      where: {
        id: venueId,
      },
    });

    if (venue) {
      const venueJSON = venue.toJSON();
      event.Venue = venueJSON;
    } else {
      event.Venue = null;
    }

    const previewImage = await EventImage.findOne({
      where: {
        eventId: id,
        preview: true
      }
    });

    if (previewImage) {
      const previewImageJSON = previewImage.toJSON();
      event.previewImage = previewImageJSON.url;
    } else {
      event.previewImage = null;
    };

    event.startDate = getDisplayDate(event.startDate);
    event.endDate = getDisplayDate(event.endDate);
  };

  return eventsArr;
};


// throw event does not exist error
function eventDoesNotExist(next) {
  const err = new Error('An event with that id does not exist');
  err.status = 404;
  return next(err);
};


// throw attendance does not exist error
function attendanceDoesNotExist(next) {
  const err = new Error('Attendance between the user and the event does not exist');
  err.status = 404;
  return next(err);
};


// get all attendees of an event by eventId
eventsRouter.get('/:eventId/attendees', async (req, res, next) => {
  const { eventId } = req.params;
  // if no user logged in
  if (!req.user) {
    const attendees = await User.findAll({
      attributes: {
        exclude: ['username']
      },
      include: {
        model: Attendance,
        where: {
          eventId,
          status: { [Op.in]: ['member', 'waitlist', 'attending'] }
        },
        attributes: ['status']
      }
    });
    return res.json({ "Attendances": attendees });
  };


  // if user logged in
  const userId = req.user.id;
  const eventExists = await Event.findByPk(eventId);

  if (!eventExists) {
    return eventDoesNotExist(next);
  };

  const group = await Group.findByPk(eventExists.groupId);

  const cohostBool = await checkCohost(userId, group.organizerId, group.id)

  if (cohostBool === true) {
    const attendees = await Attendance.findAll({
      attributes: {
        exclude: ['username']
      },
      include: {
        model: Attendance,
        where: {
          eventId
        },
        attributes: ['status']
      }
    });

    return res.json({ "Attendances": attendees });

  } else if (cohostBool instanceof Error) {
    const attendees = await User.findAll({
      attributes: {
        exclude: ['username']
      },
      include: {
        model: Attendance,
        where: {
          eventId,
          status: { [Op.in]: ['member', 'waitlist', 'attending'] }
        },
        attributes: ['status']
      }
    });

    return res.json({ "Attendances": attendees });

  };
});


// request to change the status of an attendance for an event by eventId
eventsRouter.put('/:eventId/attendance', requireAuth, validateAttendanceData, async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  const reqUserId = req.body.userId;
  const reqStatus = req.body.status;

  const eventExists = await Event.findByPk(eventId);

  if (!eventExists) {
    return eventDoesNotExist(next);
  };

  const group = await Group.findByPk(eventExists.groupId);
  const cohostBool = await checkCohost(userId, group.organizerId, group.id);

  if (cohostBool instanceof Error) {
    return next(cohostBool);
  };

  const attendanceExists = await Attendance.findOne({
    where: {
      userId: reqUserId,
      eventId
    }
  });

  if (!attendanceExists) {
    return attendanceDoesNotExist(next);
  };

  await attendanceExists.update({
    status: reqStatus
  });

  const updatedAttendance = await Attendance.findOne({
    attributes: {
      include: ['id']
    },
    where: {
      userId: reqUserId,
      eventId
    }
  });

  return res.json(updatedAttendance);

});


// request to attend an event by eventId
eventsRouter.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  const eventExists = await Event.findByPk(eventId);

  if (!eventExists) {
    return eventDoesNotExist(next);
  };

  const attendanceExists = await Attendance.findOne({
    where: {
      userId,
      eventId
    }
  });

  if (attendanceExists) {
    const { status } = attendanceExists;
    if (['pending', 'waitlist'].includes(status)) {
      const err = new Error('Attendance has already been requested');
      err.status = 400;
      return next(err);
    } else if (['member', 'attending'].includes(status)) {
      const err = new Error('User is already an attendee of the event');
      err.status = 400;
      return next(err);
    };
  };

  await Attendance.create({
    eventId,
    userId,
    status: 'pending'
  });

  const newAttendance = await Attendance.findOne({
    where: {
      eventId,
      userId,
      status: 'pending'
    }
  });

  return res.json(newAttendance);
});


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


// edit an event specified by its id
eventsRouter.put('/:eventId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { eventId } = req.params;
  const event = await Event.findByPk(eventId);

  if (!event) {
    return eventDoesNotExist(next);
  };

  const { groupId } = event;

  const group = await Group.findByPk(groupId);

  const cohostBool = await checkCohost(userId, group.organizerId, groupId);

  if (cohostBool instanceof Error) {
    return next(cohostBool);
  };

  const errors = {};

  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

  if (venueId) {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return venueDoesNotExist(next);
    };
  };

  if (name) {
    if (name.length < 5) {
      errors.name = 'Name must be at least 5 characters long';
    };
  };

  if (type) {
    if (!['Online', 'In person'].includes(type)) {
      errors.type = 'Type must be \'Online\' or \'In person\'';
    };
  };

  if (capacity) {
    if ((typeof capacity !== 'number') || (parseInt(capacity) !== capacity)) {
      errors.capacity = 'Capacity must be a positive integer';
    };
  };

  if (price) {
    const newPrice = parseFloat(price).toFixed(2);
    const newPriceParsed = parseFloat(newPrice);
    const bool = newPriceParsed === price;
    if (!bool) {
      errors.price = 'Price is invalid';
    };
  };

  if (startDate) {
    const isoBool = Validator.isISO8601(startDate);
    const lengthBool = Validator.isLength(startDate, { min: 19, max: 19 });

    if (!isoBool || !lengthBool) {
      errors.startDate = 'Start date must be in the future, format must be YYYY-MM-DD hh:mm:ss'
    };
  };

  if (endDate) {
    const isoBool = Validator.isISO8601(endDate);
    const lengthBool = Validator.isLength(endDate, { min: 19, max: 19 });

    if (!isoBool || !lengthBool) {
      errors.endDate = 'End date must be after start date, format must be YYYY-MM-DD hh:mm:ss'
    };
  };

  if (Object.keys(errors).length > 0) {
    const err = new Error('Validation error');
    err.status = 400;
    err.errors = errors;
    return next(err);
  };

  await event.update({
    "venueId": venueId ? venueId : event.venueId,
    "name": name ? name : event.name,
    "description": description ? description : event.description,
    "type": type ? type : event.type,
    "capacity": capacity ? capacity : group.capacity,
    "price": price ? price : event.price,
    "startDate": startDate ? startDate : event.price,
    "endDate": endDate ? endDate : event.endDate
  })

  const updatedEvent = await Event.findByPk(eventId);

  const updatedEventJSON = toJSONDisplay(updatedEvent, 'startDate', 'endDate');

  return res.json(updatedEventJSON);
});


// get event by eventId
eventsRouter.get('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findByPk(eventId);

  if (!event) {
    return eventDoesNotExist(next);
  };

  const group = await event.getGroup({
    attributes: {
      exclude: ['about', 'type', 'organizerId']
    }
  });

  const venue = await event.getVenue({
    attributes: {
      exclude: ['groupId']
    }
  });

  const eventImages = await event.getEventImages();

  const numAttending = await getNumAttendees(eventId);

  const eventJSON = toJSONDisplay(event, 'startDate', 'endDate');
  eventJSON.Group = group;
  eventJSON.Venue = venue;
  eventJSON.EventImages = eventImages;
  eventJSON.numAttending = numAttending;

  return res.json({ "Event": eventJSON });
});


// get all events
eventsRouter.get('/', async (req, res, next) => {
  const events = await Event.findAll({
    attributes: {
      exclude: ['price', 'capacity', 'description']
    },
    include: {
      model: Group,
      attributes: ['id', 'name', 'city', 'state']
    }
  });

  const eventsArr = await getEvents(events);

  return res.json({ "Events": eventsArr });
});


module.exports = { validateEventData, eventsRouter, getEvents }
