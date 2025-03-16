/******************************************************************************
Module: socket.js
Creation Date: March 12th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This module is a slider component that is used on the create cassettes page.
    The inclusion of this page as a component right now doesn't fit the overall
    design theme of the app, so this will be moved inot the correct location in
    the near future

Inputs:
    None

Outputs:
    Slider Component

Preconditions:
    A server running on the flask environment must be active
    
Postconditions:
    Unknown

Error Conditions:
    None

Side Effects:
    Interactions on the webpage may lead to changes in database state

Invariants:
    There will only be on instance of the server running at all times

Known Faults
    None
    
Sources: React Documentation, Tailwind CSS documentation
******************************************************************************/
/*******************************************************************************
IMPORTS
*******************************************************************************/
// From the react library import the react framework and
// the use state function
import React, { useState } from 'react';

/*******************************************************************************
PROCEDURES
*******************************************************************************/
/* This function handles the rending behavior of the slider component */
const Slider = ({ allGenres, values, setValues, dropdownValues, setDropdownValues }) => {
  
  // The following is a local function for handling input change on the slide
  const handleChange = (index, event) => {
    // Create a new list and update list with value from slide 
    const newValues = [...values];
    newValues[index] = event.target.value;

    // Compute the sum of all associations
    const sumOfValues = newValues.reduce((acc, curr) => acc + Number(curr), 0);

    // Only truly update teh associations if the sum of all
    // assocations is less than or equal to 100
    if (sumOfValues <= 100) {
      setValues(newValues);
    }
  };

  // This is a local function for when a new value
  // is selected in the dropdown
  const handleSelectChange = (index, event) => {
    // Replace the old value in the list with the
    //  new value and update the global dropdown
    // values variable
    const newDropdownValues = [...dropdownValues];
    newDropdownValues[index] = event.target.value;
    setDropdownValues(newDropdownValues);
  };

  // This function handles the behavior of adding
  // a new slider for a genre
  const addGenre = () => {
    // Essentially, only add up to the total number of
    // genres that are supported
    if (values.length < allGenres.length) {
      // Add a new association to the list
      setValues([...values, 0]);

      // The following for loop is to ensure that
      // the new dropdown takes on a value that
      // corresponds to the first available value
      for( let i = 0; i < allGenres.length; i++ )
        {
        if( !(dropdownValues.includes( allGenres[ i ].name ) ) )
          {
          setDropdownValues([...dropdownValues, allGenres[ i ].name]);
          break;
          }
        }
    }
  };

  // This is a local function to handle when a slider is deleted
  const handleDelete = (index) => {
    // The function takes the index that was passed in and 
    // Just removes it from the corresponding arrays
    const newValues = values.filter((_, i) => i !== index);
    const newDropdownValues = dropdownValues.filter((_, i) => i !== index);
    setValues(newValues);
    setDropdownValues(newDropdownValues);
  };

  // This is a local function to handle all the possible dropdown values
  const getDropdownOptions = (index) => {
    // Basically a dropdown should not include a selection if
    // is already included as a selection in a different dropdown
    return allGenres
      .map((genre) => genre.name)
      .filter((name) => !dropdownValues.includes(name) || dropdownValues[index] === name);
  };

  // Change the container height based on the number of values
  const containerHeight = `${values.length * 3}rem`;

  // Define the rendering behavior for this component
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100">
      <button type="submit" onClick={addGenre}>Add</button>
      <div className="text-center mt-2">{values.join(' - ')}</div>
      <div className={`w-1/3 relative mt-4`} style={{ height: containerHeight }}>
        {values.map((value, index) => (
          <div key={index} className="flex items-center mb-2" style={{ top: `${index * 2}rem`, transform: 'translateY(-50%)' }}>
            <select
                value={dropdownValues[index]}
                onChange={(event) => handleSelectChange(index, event)}
                className="mr-2"
              >
                {getDropdownOptions(index).map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>

            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(event) => handleChange(index, event)}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-input"
              style={{
                zIndex: index + 1
              }}
            />
            <button
              onClick={() => handleDelete(index)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the slider component
export default Slider;
