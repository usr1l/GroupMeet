// backend/routes/api/groups.js
const router = require('express').Router();
const { Group, GroupImage, User, Membership } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
    }

    delete group.GroupImages;
    const { id } = group;

    // get count of members and attach to each json object, function at top
    const numMembers = await getNumMembers(id);
    group.numMembers = numMembers;
  };
  return groupsArr;
};


// add an image by groupid
router.post('/:groupId/images', requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  // if group does not exist throw error
  let group = await Group.findByPk(groupId)
  if (!group) {
    const err = new Error('Group couldn\'t be found')
    err.status = 404;
    throw err;
  }

  // only organizer can add an image
  const { organizerId } = group;

  if (organizerId !== userId) {
    const err = new Error('Must be the organizer of the group to add an image.');
    err.status = 403;
    throw err;
  }

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
    currPreviewImg.update({
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

// get details of a group by groupid
router.get('/:groupId', requireAuth, async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findAll({
    where: {
      id: groupId
    },
    include: {
      model: GroupImage,
    }

  });

  res.json(group);
})

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
