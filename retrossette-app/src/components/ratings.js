import React from "react";

const ReviewForm = ({ rating, setRating, comment, setComment, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(rating, comment);
    }
    alert("Review submitted! Thank you.");
  };

  return (
    <div style={{ width: "300px", margin: "0 auto" }}>
      <h2>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Rating:</label>
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
          <textarea
            id="comment"
            rows="4"
            style={{ width: "100%" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
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
