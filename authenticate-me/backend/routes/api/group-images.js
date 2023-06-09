const router = require('express').Router();
const { singleMulterUpload, singleFileUpload } = require('../../awsS3');
const { Group, GroupImage, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const { requireAuth, checkAuth, checkCohost, checkAttendance, deleteAuth } = require('../../utils/auth');
const { inputToDate, toJSONDisplay, getDisplayDate, checkUserId } = require('../../utils/helpers');



router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const imageExists = await GroupImage.scope('deletion').findByPk(imageId);

  if (!imageExists) {
    const err = new Error('Group image does not exist');
    err.status = 404;
    return next(err);
  };

  const group = await imageExists.getGroup();

  const cohostBool = await checkCohost(userId, group.organizerId, group.id);

  if (cohostBool instanceof Error) {
    return next(cohostBool);
  };

  await imageExists.destroy();

  res.message = "Succesfully deleted";
  res.status = 200;
  return res.json({ message: res.message, statusCode: res.status });
});

router.post('/new', singleMulterUpload("image"), requireAuth, async (req, res, next) => {
  const { preview } = req.body;
  const imageUrl = req.file ? await singleFileUpload({ file: req.file, public: true }) : null;

  const newGroupImage = await GroupImage.create({
    url:
  })

  return;
});

module.exports = router;
