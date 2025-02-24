import React from 'react';
import '../css/Boombox.css';

const Boombox = () => {
  return (
    <div className="container">
      <div className="boombox">
        <div className="cassette-slot"></div>
        <div className="vu-meter left"></div>
        <div className="vu-meter right"></div>
        <div className="buttons">
          <div className="button">Play</div>
          <div className="button">Stop</div>
          <div className="button">Rewind</div>
        </div>
        <div className="power-button"></div>
        <div className="volume-knob"></div>
      </div>
      <div className="horizon"></div>
    </div>
  );
};

export default Boombox;
