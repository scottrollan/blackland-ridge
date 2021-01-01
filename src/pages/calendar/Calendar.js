import React, { useState, useEffect } from 'react';
import NextEventModal from '../../components/NextEventModal';
import EventModal from '../../components/EventModal';
import { Button } from 'react-bootstrap';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import {
  findNextEvent,
  thisEvent,
  eventMonth,
  eventDayOfMonth,
  eventYear,
  eventStartTime,
  eventDayOfWeek,
  eventSrc,
  months,
} from '../../functions/GetNextEvent';
import { Client } from '../api/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import styles from './Calendar.module.scss';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};
const Calendar = () => {
  const now = new Date(Date.now());
  const today = now.toISOString();
  const [events, setEvents] = useState([]);
  const [nextEvent, setNextEvent] = useState({});
  const [nextEventDay, setNextEventDay] = useState('');
  const [nextEventMonth, setNextEventMonth] = useState('');
  const [nextEventYear, setNextEventYear] = useState('');
  const [nextEventDOW, setNextEventDOW] = useState([]);
  const [nextEventStartTime, setNextEventStartTime] = useState('');
  const [nextEventSrc, setNextEventSrc] = useState('');
  let monthStart = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentMonth);
  const renderHeader = () => {
    return (
      <div className={[`${styles.header} ${styles.row} ${styles.flexMiddle}`]}>
        <div
          className={[`${styles.col} ${styles.colStart}`]}
          onClick={prevMonth}
        >
          <div className={styles.icon}>&#60;</div>
        </div>
        <div
          className={[`${styles.col} ${styles.colCenter} ${styles.stacked}`]}
        >
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
          <Button variant="light" onClick={goToToday}>
            Go To Today
          </Button>
        </div>
        <div className={[`${styles.col} ${styles.colEnd}`]} onClick={nextMonth}>
          <div className={styles.icon}>&#62;</div>
        </div>
      </div>
    );
  };

  const renderCells = (thisMonth) => {
    monthStart = startOfMonth(thisMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = 'd';
    let rows = [];
    let days = [];
    let day = startDate; // 'Fri Aug 07 2020 .....'
    let formattedDate = ''; // '7'
    let ref; // '1597291200000' (day.getTime())
    while (day <= endDate) {
      let ev = '';
      for (let i = 0; i < 7; i++) {
        //collect 7 days to make a week
        formattedDate = format(day, dateFormat);
        ref = day.getTime();
        events.map((r) => {
          const eventDate = new Date(r.start);
          const month = eventDate.getMonth();
          const dow = eventDate.getDate();
          const yr = eventDate.getFullYear();
          const startTime = eventDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          if (r.dayRef === ref) {
            ev = [
              ...ev,
              <span
                className={styles.calEventSpan}
                style={{ zIndex: '999', position: 'relative' }}
                key={r.id}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '50%',
                    borderBottom: '2px solid var(--white)',
                    transform: 'rotate(-15deg) translateX(-2px)',
                    transformOrigin: 'center center',
                    display: r.start >= today ? 'none' : 'inherit',
                  }}
                ></div>
                <EventModal
                  text={r.title}
                  id={r.id}
                  title={r.title}
                  subtitle={r.subtitle}
                  date={`${months[month]} ${dow}, ${yr}`}
                  startTime={startTime}
                  description={r.description}
                  link1={r.link1}
                  link1D={r.link1Description}
                  link2={r.link2}
                  link2D={r.link2Description}
                  src={r.imageSrc}
                />
              </span>,
            ];
          }
        });
        const cloneDay = day;

        days = [
          ...days,
          <div
            value={formattedDate}
            id={ref}
            className={[
              `${styles.col} ${styles.cell} ${
                !isSameMonth(day, monthStart)
                  ? styles.disabled
                  : isSameDay(day, selectedDate)
                  ? styles.selected
                  : ''
              }`,
            ]}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={styles.number}>{formattedDate}</span>
            {ev}
            <span className={styles.bg}>{formattedDate}</span>
          </div>,
        ];
        day = addDays(day, 1);
        ev = '';
      }
      rows = [
        ...rows,
        <div className={styles.row} key={day}>
          {days}
        </div>,
      ];
      days = []; // an array of objects
    }

    return <div className={styles.body}>{rows}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };
  const nextMonth = async () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const fetchData = async () => {
    let theseEvents = [];
    let eventsToMap;
    try {
      eventsToMap = await Client.fetch("*[_type == 'event'] | order(start)");
    } catch (error) {
      console.log(error);
    }
    eventsToMap.forEach((e) => {
      const trimDate = new Date(e.start).toString().substring(4, 15);
      const simpleDate = new Date(trimDate);
      const imageObj = e.image;
      const imageUrl = urlFor(imageObj).url().toString();
      const currentEvent = {
        id: e._id,
        start: e.start,
        dayRef: simpleDate.getTime(),
        end: e.end,
        title: e.title,
        subtitle: e.subtitle,
        description: e.description,
        link1Description: e.link1Description,
        link1: e.link1,
        link2Description: e.link2Description,
        link2: e.link2,
        imageSrc: imageUrl,
      };

      theseEvents.push(currentEvent);
    });
    setEvents(events.concat(theseEvents));
    findNextEvent(theseEvents);
    setNextEvent({ ...thisEvent });
    setNextEventMonth(eventMonth);
    setNextEventDay(eventDayOfMonth);
    setNextEventYear(eventYear);
    setNextEventDOW(eventDayOfWeek);
    setNextEventStartTime(eventStartTime);
    setNextEventSrc(eventSrc);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.calendar}>
      <div className={styles.h1Wrapper}>
        <h1>Upcoming Events</h1>
      </div>
      <div className={styles.calWrapper}>
        <div className={styles.cal}>
          {renderHeader()}
          <div className={[`${styles.days} ${styles.row}`]}>
            {[
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ].map((ddd) => {
              return (
                <span
                  className={[`${styles.col} ${styles.colCenter}`]}
                  key={ddd}
                >
                  {ddd}
                </span>
              );
            })}
          </div>
          {renderCells(currentMonth)}
        </div>
        <div
          style={{ width: '20%', display: 'flex', flexDirection: 'column' }}
          id="nextEvent"
        >
          <NextEventModal
            id={nextEvent.id}
            text={
              <div className={styles.nextEvent}>
                <h3>Next Event</h3>
                <div className={styles.datebook}>
                  <strong>
                    {nextEventDOW.map((l, index) => {
                      return <span key={`${l}${index}`}>{l}</span>;
                    })}
                  </strong>
                  <span className={styles.dayString}>{nextEventMonth}</span>
                  <span className={styles.nextEventNumber}>{nextEventDay}</span>
                </div>
                <h4>
                  <u>{nextEvent.title}</u>
                </h4>
              </div>
            }
            title={nextEvent.title}
            subtitle={nextEvent.subtitle}
            date={`${nextEventMonth} ${nextEventDay}, ${nextEventYear}`}
            startTime={nextEventStartTime}
            description={nextEvent.description}
            link1={nextEvent.link1}
            link1D={nextEvent.link1Description}
            link2={nextEvent.link2}
            link2D={nextEvent.link2Description}
            src={nextEventSrc}
          />
        </div>
      </div>
      {events.map((e, index) => {
        const thisEventDate = new Date(e.start);
        const month = thisEventDate.getMonth();
        const dow = thisEventDate.getDate();
        const yr = thisEventDate.getFullYear();
        const startTime = thisEventDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={`${e.id}${index}`}
            className={styles.nextEventsList}
            style={{
              display: e.start >= today ? 'flex' : 'none',
              backgroundColor:
                index % 2 === 0
                  ? 'var(--white)'
                  : 'var(--color-pallette-medium)',
            }}
          >
            <div className={styles.eventPicWrapper}>
              <img src={e.imageSrc} alt="" className={styles.eventPic} />
            </div>
            <div className={styles.eventInfoWrapper}>
              <h5>
                {`${months[month]} ${dow}, ${yr}`}
                <span
                  style={{ display: startTime !== '' ? 'inherit' : 'none' }}
                >
                  {' '}
                  at {startTime}
                </span>
              </h5>
              <h3>{e.title}</h3>
              <EventModal
                text="More..."
                id={e.id}
                title={e.title}
                subtitle={e.subtitle}
                date={`${months[month]} ${dow}, ${yr}`}
                startTime={startTime}
                description={e.description}
                link1={e.link1}
                link1D={e.link1Description}
                link2={e.link2}
                link2D={e.link2Description}
                src={e.imageSrc}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
