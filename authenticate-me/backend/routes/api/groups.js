// backend/routes/api/groups.js
const router = require('express').Router();
const { Group, GroupImage, User, Membership } = require('../../db/models')
const { Op } = require('sequelize');

// get all groups
router.get('/', async (_req, res) => {
  // find all and include GroupImages table
  const groups = await Group.findAll({
    include: {
      model: GroupImage,
    }
  });

  // map out the groups into JSON objects
  const groupsArr = groups.map(group => group.toJSON())
  for (let group of groupsArr) {
    // get url of the image, and attach to each json object
    const { url } = group.GroupImages[0];
    delete group.GroupImages;
    group.previewImage = url;
    const { id } = group;

    // get count of members and attach to each json object
    const numMembers = await Membership.count({
      where: {
        [Op.and]: [{ groupId: parseInt(id) }, { status: { [Op.in]: ['member', 'co-host'] } }]
      }
    })
    group.numMembers = numMembers;
  }
  res.json(groupsArr);
})

module.exports = router;
