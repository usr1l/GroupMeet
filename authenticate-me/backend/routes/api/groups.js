// backend/routes/api/groups.js
const router = require('express').Router();
const { Group, GroupImage, User, Membership, Venue } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser, checkAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateVenueData = require('./venues.js');
// const venuesRouter = require('./venues');


const validateGroupData = [
  check('name')
    .exists({ checkFalsy: true }),
  check('name')
    .custom(name => {
      if (name.length > 60) {
        return Promise.reject('name')
      }
      return true;
    })
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .exists({ checkFalsy: true })
    .custom(about => {
      if (about.length < 50) {
        return Promise.reject('about')
      }
      return true;
    })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .exists({ checkFalsy: true })
    .custom(type => {
      if (!['Online', 'In person'].includes(type)) {
        return Promise.reject('type')
      }
      return true;
    })
    .withMessage('Type must be \'Online\' or \'In person\''),
  check('private')
    .exists({ checkFalsy: true })
    .custom(private => {
      if (typeof private !== 'boolean') {
        return Promise.reject('private')
      }
      return true;
    })
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  handleValidationErrors
];


// get the count of memebers of a group
async function getNumMembers(groupId) {
  const numMembers = await Membership.count({
    where: {
      [Op.and]: [{ groupId }, { status: { [Op.in]: ['member', 'co-host'] } }]
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
  };
  return groupsArr;
};

// throw group does not exist error
function groupDoesNotExist(next) {
  const err = new Error('A group with that id does not exist');
  err.status = 404;
  return next(err);
};


// get all groups joined or organized by current user
router.get('/current', requireAuth, async (req, res) => {
  const { id } = req.user;

  // use id to get where memberships exist
  const memberships = await Membership.findAll({
    where:
    {
      [Op.and]: [{ userId: id }, { status: { [Op.in]: ['member', 'co-host'] } }]
    }
  });

  // get groupIds from memberships entries and display groups
  const groupsId = memberships.map(membership => {
    const group = membership.toJSON();
    return group.groupId;
  });

  const groups = await Group.findAll({
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


// get all venues by groupId
router.get('/:groupId/venues', async (req, res, next) => {
  let userId = req.user.id;
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    groupDoesNotExist(next)
  };

  const organizerBool = parseInt(group.organizerId) === parseInt(userId);

  const cohosts = await Membership.findAll(({
    where: {
      [Op.and]: [{ userId }, { status: 'co-host' }]
    }
  }));

  if (!organizerBool && !cohosts.length) {
    const err = new Error('Must be a co-host or organizer of this group');
    err.status = 403;
    err.title = 'Forbidden';
    next(err)
  };

  const venues = await Venue.findAll({
    where: {
      groupId
    }
  });
  res.json({ Venues: venues });
});



// create a new venue for a group specified by its id
router.post('/:groupId/venues', requireAuth, validateVenueData, async (req, res, next) => {
  let userId = req.user.id;
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    groupDoesNotExist(next)
  };

  const organizerBool = parseInt(group.organizerId) === parseInt(userId);

  const cohosts = await Membership.findAll(({
    where: {
      [Op.and]: [{ userId }, { status: 'co-host' }]
    }
  }));

  if (!organizerBool && !cohosts.length) {
    const err = new Error('Must be a co-host or organizer of this group');
    err.status = 403;
    err.title = 'Forbidden';
    next(err);
  };

  const { address, city, state, lat, lng } = req.body;
  await Venue.create({
    address, city, state, lat, lng, groupId
  })

  const newVenue = await Venue.findOne({
    where: {
      address, city, state, lat, lng, groupId
    }
  })

  res.json(newVenue);
});



// add an image by groupid
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  // if group does not exist throw error
  let group = await Group.findByPk(groupId)
  if (!group) {
    groupDoesNotExist(next)
  };

  // only organizer can add an image
  const { organizerId } = group;

  checkAuth(userId, organizerId, next);

  const { url, preview } = req.body

  // change preview img
  if (preview === true) {
    const img = await GroupImage.findOne({
      where: {
        [Op.and]: [{ groupId }, { preview: true }]
      }
    })

    const imgJSON = img.toJSON();
    const imgId = imgJSON.id

    const currPreviewImg = await GroupImage.findByPk(imgId);
    await currPreviewImg.update({
      preview: false
    })
  }

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
  }

  res.json(addedImg);
});


// edit a group by id
router.put('/:groupId', requireAuth, async (req, res, next) => {

  const { groupId } = req.params;
  const group = await Group.findByPk(groupId);

  if (!group) {
    groupDoesNotExist(next);
  };

  checkAuth(group.organizerId, req.user.id, next);

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
    next(err);
  };

  group.set({
    "name": name ? name : group.name,
    "about": about ? about : group.about,
    "type": type ? type : group.type,
    "private": private ? private : group.private,
    "city": city ? city : group.city,
    "state": state ? state : group.state
  });

  await group.save();

  const updatedGroup = await Group.findByPk(groupId);

  res.json(updatedGroup);
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
    groupDoesNotExist(next)
  };

  group.toJSON().organizerId

  const numMembers = await getNumMembers(groupId);
  const organizer = await User.scope('nameOnly').findByPk(group.organizerId);

  const groupJSON = group.toJSON();
  groupJSON.numMembers = numMembers;
  groupJSON.Organizer = organizer;

  res.json(groupJSON);
})


// get all groups
router.get('/', async (_req, res) => {
  // find all and include GroupImages table
  const groups = await Group.findAll({
    include: {
      model: GroupImage,
    }
  });
  const groupsArr = await getGroups(groups);
  return res.json({ "Groups": groupsArr });
});




// create a group
router.post('/', requireAuth, validateGroupData, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const organizerId = req.user.id;
  const newGroup = await Group.create({
    name,
    about,
    type,
    private,
    city,
    state,
    organizerId
  })

  res.json(newGroup);
})




module.exports = router;
