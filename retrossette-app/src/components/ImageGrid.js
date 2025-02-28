import React from 'react';
import "../css/ImageGrid.css";

const ImageGrid = ({ onImageClick, listOfSongs, isTrackSelection }) => {
  return (
      <div className={isTrackSelection ? "cassette-grid-container" : "grid-container"}>
      { listOfSongs.map((song, index) => (
        <img
          key={ index }
          src={ song[ "image" ] }
          alt={ `${song[ "name" ]} by ${song[ "artists" ]}` }
          title={ `${song[ "name" ]} by ${song[ "artists" ]}` }
          className={isTrackSelection ? "cassette-grid-image" : "grid-image"}
          onClick={() => onImageClick(song, index) }
        />
      ))}
    </div>
  );
};

export default ImageGrid;
