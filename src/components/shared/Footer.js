import React from 'react';
import scene from '../../assets/walkingInBR.jpg';

export default function Footer() {
  const footerStyles = {
    width: '100%',
    height: 'auto',
    padding: 0,
    margin: 0,
    zIndex: 9,
  };
  // const bumberStyles = {
  //   width: '100%',
  //   background: 'linear-gradient(transparent, #75ecf2)',
  //   height: '6rem',
  // };
  const imageStyles = {
    maxWidth: '100%',
  };

  return (
    <div style={footerStyles}>
      {/* <div style={bumberStyles} /> */}
      <img src={scene} alt="" style={imageStyles} />
    </div>
  );
}
