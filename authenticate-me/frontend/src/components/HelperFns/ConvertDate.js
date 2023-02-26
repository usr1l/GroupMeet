function convertDate(date) {

  const newDate = new Date(date.slice(0, 10));
  const newDateTime = date.slice(10);

  let dateTimeHour = parseInt(newDateTime.slice(0, 3));
  const dateTimeMinSec = newDateTime.slice(3);
  const ampm = (dateTimeHour >= 12) ? 'PM' : 'AM';

  if (dateTimeHour === 0 || dateTimeHour === 12) {
    dateTimeHour = 12;
  } else {
    dateTimeHour = dateTimeHour % 12;
    console.log(dateTimeHour, '2')
  };

  const newDateTimeString = `${dateTimeHour}${dateTimeMinSec} ${ampm}`;

  const newDateString = `${newDate}`.slice(0, 15);
  return `${newDateString} ${newDateTimeString}`;

};

export default convertDate;
