import React from 'react';

function Tags({ tags }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="tags-container">
      {tags.map((tag, index) => (
        <span key={index} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

export default Tags;