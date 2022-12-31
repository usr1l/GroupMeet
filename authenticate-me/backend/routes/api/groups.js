// backend/routes/api/groups.js
const router = require('express').Router();
const { Group, GroupImage, User, Membership, Venue, Event } = require('../../db/models');
const { Op, ValidationError } = require('sequelize');
const { requireAuth, checkAuth, checkCohost } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateVenueData } = require('./venues.js');
const { validateEventData, getEvents } = require('./events');
const { inputToDate, getDisplayDate, toJSONDisplay } = require('../../utils/helpers')
const { venueDoesNotExist } = require('./venues');


const validateGroupData = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .exists({ checkFalsy: true })
    .isIn(['Online', 'In person'])
    .withMessage('Type must be \'Online\' or \'In person\''),
  check('private')
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  handleValidationErrors
];


// get the count of members of a group
async function getNumMembers(groupId) {
  const numMembers = await Membership.count({
    where: {
      groupId,
      status: { [Op.in]: ['member', 'co-host'] }
    }
  });
  return numMembers;
};


// map all groups
async function getGroups(groups) {
  // map out the groups into JSON objects
  const groupsArr = groups.map(group => group.toJSON());
  for (let group of groupsArr) {
    // get url of the image, and attach to each json object
    if (group.GroupImages[0]) {
      const { url } = group.GroupImages[0];
      group.previewImage = url;
    };

    delete group.GroupImages;
    const { id } = group;

    // get count of members and attach to each json object, function at top
    const numMembers = await getNumMembers(id);
    group.numMembers = numMembers;

    group.createdAt = getDisplayDate(group.createdAt);
    group.updatedAt = getDisplayDate(group.updatedAt);

  };

  return groupsArr;
};


// throw group does not exist error
function groupDoesNotExist(next) {
  const err = new Error('A group with that id does not exist');
  err.status = 404;
  return next(err);
};


// throw membership does not exist error
function membershipDoesNotExist(next) {
  const err = new Error('Membership between the user and the group does not exist')
  err.status = 404;
  return next(err);
}


// request a change to a membership status by groupId
router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  const reqUserId = req.body.userId;
  const reqStatus = req.body.status;

  const groupExists = await Group.findByPk(groupId);

  if (!groupExists) {
    return groupDoesNotExist(next);
  };

  const membershipExists = await Membership.findOne({
    where: {
      userId: reqUserId,
      groupId
    }
  });

  if (!membershipExists) {
    return membershipDoesNotExist(next);
  };

  return res.json({ userId, reqUserId, reqStatus })
});


// request a membership for a group based on groupId
router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return groupDoesNotExist(next);
  };

  const membershipExists = await Membership.findOne({
    where: {
      userId,
      groupId
    }
  });

  if (membershipExists) {
    const { status } = membershipExists;
    if (status === 'pending') {
      const err = new Error('Membership has already been requested')
      err.status = 400;
      return next(err);
    } else if (['co-host', 'member'].includes(status)) {
      const err = new Error('User is already a member of this group')
      err.status = 400;
      return next(err);
    };
  };

  await Membership.create({
    groupId,
    userId,
    status: 'pending'
  })

  const newMembership = await Membership.findOne({
    where: {
      groupId,
      userId,
      status: 'pending'
    }
  })

  return res.json(newMembership);
});


// gets all events of a group specified by its id
router.get('/:groupId/events', async (req, res, next) => {
  // const userId = req.user.id;
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    return groupDoesNotExist(next);
  };

  const events = await Event.findAll({
    attributes: {
      exclude: ['price', 'capacity', 'description']
    },
    where: {
      groupId
    },
    include: {
      model: Group,
      attributes: ['id', 'name', 'city', 'state']
    }
  });

  const eventsArr = await getEvents(events);

  return res.json({ "Events": eventsArr });


});


// create an event for a group specified by its id
router.post('/:groupId/events', requireAuth, validateEventData, async (req, res, next) => {

  const userId = req.user.id;
  const { groupId } = req.params;

  const group = await Group.findByPk(groupId);

  // check if group exists
  if (!group) {
    return groupDoesNotExist(next);
  };

  // check for user auth
  const cohostBool = await checkCohost(userId, group.organizerId, groupId);
  if (cohostBool instanceof Error) {
    return next(cohostBool);
  };


  const {
    name,
    description,
    type,
    capacity,
    price,
    startDate,
    endDate,
    venueId
  } = req.body;

  // check if venue exists
  if (venueId) {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return venueDoesNotExist(next);
    };
  };


  // create a new event if it doesn't already exist
  const eventExists = await Event.findOne({
    where: {
      name,
      description,
      type,
      capacity,
      price,
      startDate,
      endDate,
      venueId,
      groupId
    }
  });

  if (eventExists) {
    const newError = new Error('Failed: This event already exists');
    newError.status = 409;
    return next(newError);
  };


  await Event.create({
    name,
    description,
    type,
    capacity,
    price,
    startDate,
    endDate,
    venueId,
    groupId
  });


  // find if successful
  const newEvent = await Event.findOne({
    where: {
      name,
      description,
      type,
      capacity,
      price,
      startDate,
      endDate,
      venueId,
      groupId
    }
  });

  const newEventJSON = toJSONDisplay(newEvent, 'startDate', 'endDate')

  return res.json(newEventJSON);
});


// get all venues by groupId
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
  let userId = req.user.id;
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    return groupDoesNotExist(next)
  };

  const cohostBool = await checkCohost(userId, group.organizerId, groupId);

  if (cohostBool instanceof Error) {
    return next(cohostBool);
  };

  const venues = await Venue.findAll({
    where: {
      groupId
    }
  });

  return res.json({ Venues: venues });

});


// create a new venue for a group specified by its id
router.post('/:groupId/venues', requireAuth, validateVenueData, async (req, res, next) => {
  let userId = req.user.id;
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    return groupDoesNotExist(next)
  };

  const cohostBool = await checkCohost(userId, group.organizerId, groupId);

  if (cohostBool instanceof Error) {
    return next(cohostBool);
  };
  const { address, city, state, lat, lng } = req.body;
  await Venue.create({
    address, city, state, lat, lng, groupId
  });

  const newVenue = await Venue.findOne({
    where: {
      address, city, state, lat, lng, groupId
    }
  })

  return res.json(newVenue);

});



// add an image by groupid
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  // if group does not exist throw error
  let group = await Group.findByPk(groupId)
  if (!group) {
    return groupDoesNotExist(next);
  };

  // only organizer can add an image
  const { organizerId } = group;

  const checkAuthBool = checkAuth(userId, organizerId);

  if ((checkAuthBool) instanceof Error) {
    return next(checkAuthBool);
  };

  const { url, preview } = req.body;

  // change preview img
  if (preview === true) {
    const img = await GroupImage.findOne({
      where: {
        [Op.and]: [{ groupId }, { preview: true }]
      }
    })

    if (img) {
      const imgJSON = img.toJSON();
      const imgId = imgJSON.id

      const currPreviewImg = await GroupImage.findByPk(imgId);
      await currPreviewImg.update({
        preview: false
      });
    };
  };

  // add the new img
  const newImg = await GroupImage.create({
    url,
    preview,
    groupId
  });

  let addedImg;

  if (newImg) {
    addedImg = newImg.toSafeObject();
  } else {
    addedImg = null;
  };

  return res.json(addedImg);
});


// get all groups joined or organized by current user
router.get('/current', requireAuth, async (req, res) => {
  const { id } = req.user;

  // use id to get where memberships exist
  const memberships = await Membership.findAll({
    where: {
      userId: id,
      status: { [Op.in]: ['member', 'co-host'] }
    }
  });

  // get groupIds from memberships entries and display groups
  const groupsId = memberships.map(membership => {
    const membershipJSON = membership.toJSON();
    return membershipJSON.groupId;
  });

  const groups = await Group.scope('allDetails').findAll({
    where: {
      id: { [Op.in]: [...groupsId] }
    },
    include: {
      model: GroupImage,
    }
  });

  const Groups = await getGroups(groups);

  // displays same as res from get all
  return res.json({ Groups });
});


// edit a group by id
router.put('/:groupId', requireAuth, async (req, res, next) => {

  const { groupId } = req.params;
  const group = await Group.scope('allDetails').findByPk(groupId);

  if (!group) {
    return groupDoesNotExist(next);
  };

  const checkAuthBool = checkAuth(req.user.id, group.organizerId);

  if ((checkAuthBool) instanceof Error) {
    return next(checkAuthBool);
  };

  const errors = {};

  const { name, about, type, private, city, state } = req.body;

  if (name) {
    if (name.length > 60) {
      errors.name = 'Name must be 60 characters or less';
    };
  };

  if (about) {
    if (about.length < 50) {
      errors.about = 'About must be 50 characters or more';
    };
  };

  if (type) {
    if (!['Online', 'In person'].includes(type)) {
      errors.type = 'Type must be \'Online\' or \'In person\'';
    };
  };

  if (private) {
    if (typeof private !== 'boolean') {
      errors.private = 'Private must be a boolean';
    };
  };

  if (Object.keys(errors).length > 0) {
    const err = new Error('Validation error');
    err.status = 400;
    err.errors = errors;
    return next(err);
  };

  await group.update({
    "name": name ? name : group.name,
    "about": about ? about : group.about,
    "type": type ? type : group.type,
    "private": private ? private : group.private,
    "city": city ? city : group.city,
    "state": state ? state : group.state,
    "updatedAt": getDisplayDate(new Date())
  });

  const updatedGroup = await Group.scope('allDetails').findByPk(groupId);

  const updatedGroupJSON = toJSONDisplay(updatedGroup, 'createdAt', 'updatedAt');

  return res.json(updatedGroupJSON);
});

// get details of a group by groupid
router.get('/:groupId', requireAuth, async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.scope('allDetails').findOne({
    where: {
      id: groupId
    },
    include: {
      model: GroupImage
    }
  });

  if (!group) {
    return groupDoesNotExist(next)
  };

  const numMembers = await getNumMembers(groupId);
  const organizer = await User.scope('nameOnly').findByPk(group.organizerId);
  const venues = await group.getVenues();

  const groupJSON = toJSONDisplay(group, 'createdAt', 'updatedAt');

  groupJSON.numMembers = numMembers;
  groupJSON.Organizer = organizer;
  groupJSON.Venues = venues;

  return res.json(groupJSON);
});


// get all groups
router.get('/', async (_req, res) => {
  // find all and include GroupImages table
  const groups = await Group.scope('allDetails').findAll({
    include: {
      model: GroupImage,
    }
  });
  const groupsArr = await getGroups(groups);
  return res.json({ "Groups": groupsArr });
});



// create a group
router.post('/', requireAuth, validateGroupData, async (req, res, next) => {
  const { name, about, type, private, city, state } = req.body;
  const organizerId = req.user.id;

  const groupExists = await Group.findOne({
    where: {
      name,
      about,
      type,
      private,
      city,
      state,
      organizerId
    }
  });


  // create a group if it doesnt already exist
  if (groupExists) {
    const newError = new Error('Failed: This group already exists');
    newError.status = 409;
    return next(newError);
  };

  await Group.create({
    name,
    about,
    type,
    private,
    city,
    state,
    organizerId
  });

  const newGroup = await Group.scope('allDetails').findOne({
    where: {
      name,
      about,
      type,
      private,
      city,
      state,
      organizerId
    }
  });

  await Membership.create({
    userId: newGroup.organizerId,
    groupId: newGroup.id,
    status: 'co-host'
  });

  const newGroupJSON = toJSONDisplay(newGroup, 'createdAt', 'updatedAt');

  return res.json(newGroupJSON);
});



module.exports = router;
