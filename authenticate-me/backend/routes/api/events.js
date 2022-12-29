// backend/routes/api/events.js
const eventsRouter = require('express').Router();
const { Group, GroupImage, User, Membership, Venue } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, checkAuth, checkCohost } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { inputToDate } = require('../../utils/helpers')


const validateEventData = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters long'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('type')
    .exists({ checkFalsy: true })
    .isIn(['Online', 'In person'])
    .withMessage('Type must be \'Online\' or \'In person\''),
  check('capacity')
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .custom(price => {
      const newPrice = parseFloat(price).toFixed(2);
      const newPriceParsed = parseFloat(newPrice);
      const bool = newPriceParsed === price;
      if (!bool) {
        return Promise.reject('price');
      };
      return true;
    })
    .withMessage('Price is invalid'),
  check('startDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .custom(startDate => {
      const date = inputToDate(startDate);
      if (date < new Date()) {
        return Promise.reject('startDate')
      };
      return true;
    })
    .withMessage('Start date must be in the future, format must be YYYY-MM-DD hh:mm:ss'),
  check('endDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .custom((endDate, { req }) => {
      const startDate = inputToDate(req.body.startDate);
      const date = inputToDate(endDate);
      if (date < startDate) {
        return Promise.reject('startDate')
      };
      return true;
    })
    .withMessage('End date must be after start date, format must be YYYY-MM-DD hh:mm:ss'),
  handleValidationErrors
];

module.exports = { validateEventData }
