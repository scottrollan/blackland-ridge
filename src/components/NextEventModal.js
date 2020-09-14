import React from 'react';
import EventModal from './EventModal';

const NextEventModal = ({
  id,
  title,
  subtitle,
  description,
  date,
  startTime,
  link1,
  link1D,
  link2,
  link2D,
  src,
  text,
}) => {
  return (
    <span id={id}>
      <EventModal
        text={text}
        title={title}
        subtitle={subtitle}
        description={description}
        date={date}
        startTime={startTime}
        link1={link1}
        link1D={link1D}
        link2={link2}
        link2D={link2D}
        src={src}
      />
    </span>
  );
};

export default NextEventModal;
