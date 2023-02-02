const getCurrTime = () => {
  const currDay = new Date();
  const year = currDay.getFullYear();
  let month = currDay.getMonth() + 1;
  let day = currDay.getDate();
  let hours = currDay.getHours();
  let minutes = currDay.getMinutes();
  let seconds = currDay.getSeconds();
  if (`${month}`.length === 1) {
    month = `0${month}`
  };
  if (`${day}`.length === 1) {
    day = `0${day}`
  };
  if (`${hours}`.length === 1) {
    hours = `0${hours}`
  };
  if (`${minutes}`.length === 1) {
    minutes = `0${minutes}`
  };
  if (`${seconds}`.length === 1) {
    seconds = `0${seconds}`
  };
  const currDate = `${year}-${month}-${day}`;
  const currTime = `${hours}:${minutes}:${seconds}`;
  const currDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return { currDateTime, currTime, currDate };
}

export default getCurrTime;
