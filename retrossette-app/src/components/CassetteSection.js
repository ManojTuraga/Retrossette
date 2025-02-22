import React from 'react';
import "../css/CassetteSection.css";

const CassetteSection = ( { progressPercent } ) => {
  return (
    <div className="cassette-container">
      <img src={`${process.env.PUBLIC_URL}/cassette.jpg`} alt="Cassette" className="cassette-image" />
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>
    </div>
  );
};

export default CassetteSection;