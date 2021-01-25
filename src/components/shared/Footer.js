import React from 'react';
// import scene from '../../assets/walkingInBR.jpg';

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
      <img
        src="https://firebasestorage.googleapis.com/v0/b/trans-falcon-287713.appspot.com/o/images%2Falbums%2Fmisc%2FTpONi752walkingInBR.jpg?alt=media&token=4fc053de-8f06-4203-9920-9363097e775b"
        alt=""
        style={imageStyles}
      />
    </div>
  );
}
