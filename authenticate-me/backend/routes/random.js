const router = require('express').Router();
const { Group, User, Membership } = require('../db/models')

router.get('/', async (_req, res) => {
  // const person = await User.findByPk(1);
  // await person.destroy();
  const memberships = await Membership.findAll();
  res.json(memberships)
})


module.exports = router;
