let thisEvent = {};
let eventMonth = '';
let eventDayOfMonth = '';
let eventStartTime = '';
let eventEndTime = '';
let eventYear = '';
let eventDayOfWeek = '';
let eventSrc = '';

const now = new Date(Date.now());
const today = now.toISOString();

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const spanishMonths = {
  January: 'enero',
  February: 'febrero',
  March: 'marzo',
  April: 'abril',
  May: 'mayo',
  June: 'junio',
  July: 'julio',
  August: 'agosto',
  September: 'septiembre',
  October: 'octubre',
  November: 'noviembre',
  December: 'deciembre',
};
const meses = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'deciembre',
];
const days = [
  ['S', 'u', 'n', 'd', 'a', 'y'],
  ['M', 'o', 'n', 'd', 'a', 'y'],
  ['T', 'u', 'e', 's', 'd', 'a', 'y'],
  ['W', 'e', 'd', 'n', 'e', 's', 'd', 'a', 'y'],
  ['T', 'h', 'u', 'r', 's', 'd', 'a', 'y'],
  ['F', 'r', 'i', 'd', 'a', 'y'],
  ['S', 'a', 't', 'u', 'r', 'd', 'a', 'y'],
];
const spanishDays = {
  Sunday: ['d', 'o', 'm', 'i', 'n', 'g', 'o'],
  Monday: ['l', 'u', 'n', 'e', 's'],
  Tuesday: ['m', 'a', 'r', 't', 'e', 's'],
  Wednesday: ['m', 'i', 'é', 'r', 'c', 'o', 'l', 'e', 's'],
  Thursday: ['j', 'u', 'e', 'v', 'e', 's'],
  Friday: ['v', 'i', 'e', 'r', 'n', 'e', 's'],
  Saturday: ['s', 'á', 'b', 'a', 'd', 'o'],
};

const findNextEvent = (array) => {
  const next = array.find((ev) => {
    return ev.start > today;
  });

  thisEvent = { ...next };
  const d = new Date(next.start);
  //get month number (0-11), then month name from array
  const monthNum = d.getMonth();
  eventMonth = months[monthNum];
  //get day of the month (1-31)
  eventDayOfMonth = d.getDate();
  //get year
  eventYear = d.getFullYear();

  //get starting time
  let amPm = 'AM';
  let hr = d.getHours();
  if (hr > 12) {
    hr = hr - 12;
    amPm = 'PM';
  }
  hr = parseInt(hr);
  let min = d.getMinutes();
  if (min < 10) {
    min = '0' + parseInt(min);
  } else {
    min = parseInt(min);
  }
  eventStartTime = `${hr}:${min} ${amPm}`;

  const DOW = d.getDay();
  eventDayOfWeek = days[DOW];

  //get src for image
  eventSrc = next.imageSrc;

  const end = next.end;
  let endDate;
  if (end) {
    endDate = end.toString();
  }
  const formatEndDate = new Date(endDate);
  //get end time
  eventEndTime = formatEndDate.toLocaleTimeString();
  // console.log(end - d);
};

export {
  findNextEvent,
  thisEvent,
  eventMonth,
  eventDayOfMonth,
  eventYear,
  eventStartTime,
  eventEndTime,
  eventDayOfWeek,
  eventSrc,
  months,
  meses,
  spanishDays,
};
