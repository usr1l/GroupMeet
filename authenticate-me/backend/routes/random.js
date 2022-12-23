const router = require('express').Router();
const { Group, User } = require('../db/models')

router.get('/', async (_req, res) => {
  // const person = await User.findByPk(1);
  // await person.destroy();
  const groups = await Group.findAll({
    include: { model: User }
  });
  res.json({
    groups,
    // person
  })
})


module.exports = router;
