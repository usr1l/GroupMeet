const router = require('express').Router();
const { singleMulterUpload, singleFileUpload, multipleMulterUpload, multipleFilesUpload, retrievePrivateFile } = require('../../awsS3');
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

router.post('/groups/:groupId', multipleMulterUpload("images"), requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const keys = await multipleFilesUpload({ files: req.files, public: true });
  const userId = req.user.id;

  const images = await Promise.all(
    keys.map(key => GroupImage.create({ url: key, preview: false, groupId }))
  );


  const resImages = await GroupImage.findAll({
    where: {
      groupId
    }
  });
  return res.json(resImages);
});

// get from aws
router.get(
  '/:userId',
  async (req, res) => {
    const images = await Image.findAll({ where: { userId: req.params[ "userId" ] } });
    const imageUrls = images.map(image => retrievePrivateFile(image.key));
    return res.json(imageUrls);
  }
);

module.exports = router;
