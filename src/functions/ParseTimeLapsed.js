export const parseTimeLapsed = (num) => {
  //num will be time in milliseconds
  let [minutes, hours, days, weeks, years] = [0];
  // let minutes = 0;
  // let hours = 0;
  // let days = 0;
  // let weeks = 0;
  // let years = 0;
  switch (true) {
    case num > 31536000000: //more than a year
      years = num / 31536000000;
      years = years.toFixed(0);
      return `${years}y`;
    case num > 1209600000: //more than 2 weeks
      weeks = num / 604800000; //get weeks
      weeks = weeks.toFixed(0);
      return `${weeks}w`;
    case num > 172800000: //more than 2 days
      days = num / 86400000; //get days
      days = days.toFixed(0);
      return `${days}d`;
    case num > 7200000: //more than 2 hours
      hours = num / 3600000; //get hours
      hours = hours.toFixed(0);
      return `${hours}h`;
    case num < 7200000: //less than 2 hours
      minutes = num / 60000;
      minutes = minutes.toFixed(0);
      return `${minutes}m`;
    default:
      return '';
  }
};
