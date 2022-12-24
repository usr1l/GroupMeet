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
    const { url } = group.GroupImages[0];
    delete group.GroupImages;
    group.previewImage = url;
    const { id } = group;

    // get count of members and attach to each json object, function at top
    const numMembers = await getNumMembers(id);
    group.numMembers = numMembers;
  };
  return groupsArr;
};



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



// create a group
router.post(
  '/',
  requireAuth,
  validateGroupData,
  async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    res.json('end')
  })

module.exports = router;
