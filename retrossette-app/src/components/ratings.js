/******************************************************************************
Module: ratings.js
Creation Date: March 23th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This is the component that allows users to add their opinions to the playlist
    that they are currently listening to. Users have the option of giving a
    rating of 0 to 5 stars and they can leave a commment on what the think
    about the playlist

Inputs:
    None

Outputs:
    Ratings Component

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
import React from "react";

/*******************************************************************************
PROCEDURES
*******************************************************************************/
// Define the rendering behavior of the review form
const ReviewForm = ({ rating, setRating, comment, setComment, onSubmit }) => {
  // Define a function to tell the user that the review
  // has been submitted if the button was clicked
  const handleSubmit = (e) => {
    e.preventDefault();
    // If we are submitting, use the onsubmit behavior defined in the property
    if (onSubmit) {
      onSubmit(rating, comment);
    }

    // Tell the user that the review was submitted 
    alert("Review submitted! Thank you.");
  };

  return (
    <div style={{ width: "300px", margin: "0 auto" }}>
      <h2>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Rating:</label>
          {/* This part defines the behavior for the stars that the
              user can select. They can select between 0 and 5 stars */}
          <div id="rating">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                style={{
                  cursor: "pointer",
                  color: index < rating ? "gold" : "gray",
                  fontSize: "24px",
                }}
                onClick={() => setRating(index + 1)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="comment">Comment:</label>
          {/* This part defines the rendering behavior for the user comments */}
          <textarea
            id="comment"
            rows="4"
            style={{ width: "100%" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        {/* This part defines the rendering behavior for the rating submit button */}
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
