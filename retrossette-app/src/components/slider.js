import React, { useState } from 'react';

const Slider = ({ allGenres }) => {
  const [values, setValues] = useState([]);
  const [dropdownValues, setDropdownValues] = useState([]);

  const handleChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    const sumOfValues = newValues.reduce((acc, curr) => acc + Number(curr), 0);

    if (sumOfValues <= 100) {
      console.log(sumOfValues);
      setValues(newValues);
    }
  };

  const handleSelectChange = (index, event) => {
    const newDropdownValues = [...dropdownValues];
    newDropdownValues[index] = event.target.value;
    setDropdownValues(newDropdownValues);
  };

  const addGenre = () => {
    setValues([...values, 0]);
    setDropdownValues([...dropdownValues, '']);
  };

  const handleDelete = (index) => {
    const newValues = values.filter((_, i) => i !== index);
    const newDropdownValues = dropdownValues.filter((_, i) => i !== index);
    setValues(newValues);
    setDropdownValues(newDropdownValues);
  };

  const getDropdownOptions = (index) => {
    return allGenres
      .map((genre) => genre.name)
      .filter((name) => !dropdownValues.includes(name) || dropdownValues[index] === name);
  };

  const containerHeight = `${values.length * 3}rem`; // Adjust height based on number of sliders

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100">
      <button type="submit" onClick={addGenre}>Add</button>
      <div className="text-center mt-2">{values.join(' - ')}</div>
      <div className={`w-1/3 relative mt-4`} style={{ height: containerHeight }}> {/* Adjusted width from 1/2 to 1/3 */}
        {values.map((value, index) => (
          <div key={index} className="flex items-center mb-2" style={{ top: `${index * 2}rem`, transform: 'translateY(-50%)' }}>
            <select
              value={dropdownValues[index] || ''}
              onChange={(event) => handleSelectChange(index, event)}
              className="mr-2"
            >
              <option value="">Select an genre</option>
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

export default Slider;
