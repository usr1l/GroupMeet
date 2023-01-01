const { User } = require('../db/models')

function getDisplayDate(date) {
  const displayDate = date.toISOString().split('');
  displayDate.splice(10, 1, ' ');
  displayDate.splice(19, 5);

  return displayDate.join('');
};

function inputToDate(date) {
  const parts = date.split(' ');
  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':');
  const newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);

  return newDate;
};

function toJSONDisplay(input, startField, endField) {
  const inputJSON = input.toJSON();

  inputJSON[`${startField}`] = getDisplayDate(inputJSON[`${startField}`]);
  inputJSON[`${endField}`] = getDisplayDate(inputJSON[`${endField}`]);

  return inputJSON;
};

async function checkUserId(reqUserId) {
  const userExists = await User.findByPk(reqUserId);

  if (!userExists) {
    const err = new Error('This user does not exist');
    err.status = 404;
    return err;
  };

  return true;
};



module.exports = {
  inputToDate,
  getDisplayDate,
  toJSONDisplay,
  checkUserId
}
