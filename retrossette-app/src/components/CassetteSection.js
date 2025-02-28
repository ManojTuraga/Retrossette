import React from 'react';
import "../css/CassetteSection.css";

const CassetteSection = ( { progressPercent } ) => {
  return (
    <div className="cassette-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ height: `${progressPercent}%` }}></div>
      </div>
    </div>
  );
};

export default CassetteSection;
