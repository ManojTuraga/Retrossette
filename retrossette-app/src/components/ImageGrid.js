import React from 'react';
import "../css/ImageGrid.css";

const ImageGrid = ({ onImageClick, listOfSongs }) => {
  return (
    <div className="grid-container">
      { listOfSongs.map((song, index) => (
        <img
          key={ index }
          src={ song[ "image" ] }
          alt={ `${song[ "name" ]} by ${song[ "artists" ]}` }
          title={ `${song[ "name" ]} by ${song[ "artists" ]}` }
          className="grid-image"
          onClick={() => onImageClick(song, index) }
        />
      ))}
    </div>
  );
};

export default ImageGrid;
