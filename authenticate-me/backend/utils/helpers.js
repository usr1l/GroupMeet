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
  const newDate = new Date(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1], timeParts[2]);

  return newDate;
};

function toJSONDisplay(input, startField, endField) {
  const inputJSON = input.toJSON();

  inputJSON[`${startField}`] = getDisplayDate(inputJSON[`${startField}`]);
  inputJSON[`${endField}`] = getDisplayDate(inputJSON[`${endField}`]);

  return inputJSON;
}

module.exports = {
  inputToDate,
  getDisplayDate,
  toJSONDisplay
}
