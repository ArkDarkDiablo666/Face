import React from 'react';
import './Loading.css'; // Import the CSS file for styling

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p className='title'>Chờ xíu...</p>
    </div>
  );
};

export default Loading;