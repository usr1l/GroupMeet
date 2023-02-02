// backend/routes/api/events.js
const eventsRouter = require('express').Router();
const { Group, User, Venue, Event, EventImage, Attendance } = require('../../db/models');
const { Op, Validator } = require('sequelize');
const { requireAuth, checkAuth, checkCohost, checkAttendance, deleteAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { inputToDate, toJSONDisplay, getDisplayDate, checkUserId, updateEventPreviewImage } = require('../../utils/helpers');
const { venueDoesNotExist } = require('./venues');
const { validateAttendanceData } = require('./attendances');
const { Sequelize } = require('sequelize')


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
    .isIn([ 'Online', 'In person' ])
    .withMessage('Type must be \'Online\' or \'In person\''),
  check('capacity')
    .custom(capacity => {
      if (((isNaN(capacity)) || capacity < 0) && capacity !== undefined && capacity !== null) {
        return Promise.reject('capacity')
      };
      return true;
    })
    .withMessage('Capacity must be a positive integer'),
  check('price')
    .custom(price => {
      if ((!isNaN(price)) && price > 0) {
        const newPrice = parseFloat(price).toFixed(2);
        const newPriceParsed = parseFloat(newPrice);
        const bool = newPriceParsed === price;
        if (!bool) {
          return Promise.reject('price');
        };
        return true;
      } else if (price === undefined || price === null) {
        return true;
      }
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
      status: { [ Op.in ]: [ 'member', 'attending' ] }
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
        exclude: [ 'address', 'lng', 'lat', 'groupId' ]
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


// delete an attendance by userId
eventsRouter.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
  // check if event exists
  const { eventId } = req.params;
  const eventExists = await Event.findByPk(eventId);

  if (!eventExists) {
    return eventDoesNotExist(next);
  };

  const reqUserId = req.body.userId;

  // check if the request userId belongs to existing user
  const userExists = await checkUserId(reqUserId);

  if (userExists instanceof Error) {
    return next(userExists);
  };

  // check if current user is making deletion, or if USER is organizer or cohost
  const userId = req.user.id;
  const group = await Group.findByPk(eventExists.groupId);

  const deletePermission = await deleteAuth(userId, group.organizerId, group.id, reqUserId);

  if (deletePermission instanceof Error) {
    next(deletePermission);
  };

  const deleteAttendance = await Attendance.findOne({
    where: {
      eventId,
      userId: reqUserId
    }
  });

  if (!deleteAttendance) {
    const err = new Error('Attendance does not exist for this User');
    err.status = 404;
    return next(err);
  };

  await deleteAttendance.destroy();

  res.message = "Succesfully deleted";
  res.status = 200;
  return res.json({ message: res.message, statusCode: res.status });
});



// get all attendees of an event by eventId
eventsRouter.get('/:eventId/attendees', async (req, res, next) => {
  // check if event exists
  const { eventId } = req.params;
  const eventExists = await Event.findByPk(eventId);

  if (!eventExists) {
    return eventDoesNotExist(next);
  };

  // if no user logged in
  if (!req.user) {
    const attendees = await User.findAll({
      attributes: {
        exclude: [ 'username' ]
      },
      include: {
        model: Attendance,
        where: {
          eventId,
          status: { [ Op.in ]: [ 'member', 'waitlist', 'attending' ] }
        },
        attributes: [ 'status' ]
      }
    });
    return res.json({ "Attendances": attendees });
  };

  // if user logged in
  const userId = req.user.id;
  const group = await Group.findByPk(eventExists.groupId);

  const cohostBool = await checkCohost(userId, group.organizerId, group.id)

  if (cohostBool === true) {
    const attendees = await User.findAll({
      attributes: {
        exclude: [ 'username' ]
      },
      order: [ [ 'firstName' ], [ 'lastName' ] ],
      include: {
        model: Attendance,
        where: {
          eventId
        },
        attributes: [ 'status' ]
      }
    });

    return res.json({ "Attendances": attendees });

  } else if (cohostBool instanceof Error) {
    const attendees = await User.findAll({
      attributes: {
        exclude: [ 'username' ]
      },
      order: [ [ 'firstName' ], [ 'lastName' ] ],
      include: {
        model: Attendance,
        where: {
          eventId,
          status: { [ Op.in ]: [ 'member', 'waitlist', 'attending' ] }
        },
        attributes: [ 'status' ]
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
      include: [ 'id' ]
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
    if ([ 'pending', 'waitlist' ].includes(status)) {
      const err = new Error('Attendance has already been requested');
      err.status = 400;
      return next(err);
    } else if ([ 'member', 'attending' ].includes(status)) {
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
    await updateEventPreviewImage(eventId);
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

  const { venueId, name, type, capacity, price, description, startDate, endDate, previewImage } = req.body;

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
    if (![ 'Online', 'In person' ].includes(type)) {
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
    "capacity": capacity ? capacity : null,
    "price": price ? price : null,
    "startDate": startDate ? startDate : event.startDate,
    "endDate": endDate ? endDate : event.endDate
  });


  if (previewImage && previewImage !== event.previewImage) {
    await updateEventPreviewImage(eventId);
    await EventImage.create({
      url: previewImage,
      eventId: eventId,
      preview: true
    });
  };

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
      exclude: [ 'about', 'type', 'organizerId' ]
    }
  });

  const venue = await event.getVenue({
    attributes: {
      exclude: [ 'groupId' ]
    }
  });

  const eventImages = await event.getEventImages();

  const numAttending = await getNumAttendees(eventId);

  const previewImage = await EventImage.findOne({
    where: {
      preview: true,
      eventId
    }
  });

  const eventJSON = toJSONDisplay(event, 'startDate', 'endDate');
  eventJSON.Group = group;
  eventJSON.Venue = venue;
  eventJSON.EventImages = eventImages;
  eventJSON.numAttending = numAttending;

  if (previewImage) {
    eventJSON.previewImage = previewImage.url;
  };

  return res.json({ "Event": eventJSON });
});


// delete an event
eventsRouter.delete('/:eventId', requireAuth, async (req, res, next) => {

  const { eventId } = req.params;
  const userId = req.user.id;

  const eventExists = await Event.findByPk(eventId);
  if (!eventExists) {
    return eventDoesNotExist(next);
  };

  const group = await Group.findByPk(eventExists.groupId)

  if (userId !== group.organizerId) {
    const err = new Error('Group must belong to current user');
    err.status = 403;
    return next(err);
  };

  await eventExists.destroy();

  res.message = "Succesfully deleted";
  res.status = 200;
  return res.json({ message: res.message, statusCode: res.status });
});


// get all events
eventsRouter.get('/', async (req, res, next) => {

  let { name, type, page, size, startDate } = req.query;
  const errors = {};
  const where = {};

  const pagination = {};

  page = page === undefined ? 1 : parseInt(page);
  size = size === undefined ? 20 : parseInt(size);

  page = page > 10 ? 10 : page;
  page = page < 1 ? errors.page = 'Page must be greater than or equal to 1' : page;

  size = size > 20 ? 20 : size;
  size = size < 1 ? errors.size = 'Size must be greater than or equal to 1' : size;

  pagination.limit = size;
  pagination.offset = size * (page - 1);

  if (name) {
    if (isNaN(name)) {
      where.name = name;
    } else {
      errors.name = 'Name must be a string';
    }
  };

  if (type) {
    if ([ 'Online', 'In person' ].includes(type)) {
      where.type = type;
    } else {
      errors.type = 'Type must be \'Online\' or \'In person\'';
    };
  };

  if (startDate) {
    if (Validator.isISO8601(startDate) && startDate.length === 19) {
      startDate = startDate.split(' ').join('T').concat('.000Z');
      where.startDate = `${startDate}`;
    } else {
      errors.startDate = 'Start date must be a valid datetime, format must be YYYY-MM-DD hh:mm:ss'
    };
  };

  if (Object.keys(errors).length > 0) {
    const err = new Error('Validation error')
    err.status = 400;
    err.errors = errors;
    return next(err);
  };

  const events = await Event.findAll({
    where,
    attributes: {
      exclude: [ 'price', 'capacity', 'description' ]
    },
    order: [ [ 'name' ], [ 'type' ] ],
    include: {
      model: Group,
      attributes: [ 'id', 'name', 'city', 'state' ]
    },
    ...pagination
  });

  const eventsArr = await getEvents(events);

  return res.json({ "Events": eventsArr });
});


module.exports = { validateEventData, eventsRouter, getEvents }
