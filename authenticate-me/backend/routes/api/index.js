// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const { venuesRouter } = require('../api/venues')
const { restoreUser } = require("../../utils/auth.js");
const { eventsRouter } = require('./events')
const groupImageRouter = require('./group-images');
const eventImageRouter = require('./event-images');

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/event-images', eventImageRouter);

router.use('/group-images', groupImageRouter);

router.use('/events', eventsRouter);

router.use('/venues', venuesRouter);

router.use('/groups', groupsRouter);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

// router.post('/test', (req, res) => {
//   res.json({ requestBody: req.body });
// });

module.exports = router;
