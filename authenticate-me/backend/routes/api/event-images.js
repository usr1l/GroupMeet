const router = require('express').Router();
const { Group, GroupImage, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const { requireAuth, checkAuth, checkCohost, checkAttendance, deleteAuth } = require('../../utils/auth');
const { inputToDate, toJSONDisplay, getDisplayDate, checkUserId } = require('../../utils/helpers');


router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const imageExists = await EventImage.scope('deletion').findByPk(imageId);

  if (!imageExists) {
    const err = new Error('Event image does not exist');
    err.status = 404;
    return next(err);
  };

  const event = await imageExists.getEvent();
  const group = await event.getGroup();

  const cohostBool = await checkCohost(userId, group.organizerId, group.id);

  if (cohostBool instanceof Error) {
    return next(cohostBool);
  };

  await imageExists.destroy();

  res.message = "Succesfully deleted";
  res.status = 200;
  return res.json({ message: res.message, statusCode: res.status });
});


module.exports = router;
