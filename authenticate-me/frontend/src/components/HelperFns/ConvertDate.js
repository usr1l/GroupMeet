const convertDate = (date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const numbers = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];
  const year = date.slice(0, 4);
  let month = date.slice(5, 7);
  const day = date.slice(8, 10);


  for (let i in numbers) {
    if (numbers[ i ] === month) {
      month = months[ i ];
    };
  };

  const newDate = `${month} ${day}, ${year}`
  return newDate;
}

export default convertDate;
