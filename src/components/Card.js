import React from 'react';

const Card = ({ header, count, color }) => {
  return (
    <div className={`card text-white bg-${color} mb-3`} style={{ maxWidth: '24rem', height: '170px' }}>
      <div className="card-header">{header}</div>
      <div className="card-body d-flex flex-column justify-content-center">
        <h5 className="card-title" style={{ fontSize: '2.5rem' }}>{count}</h5>
        <p className="card-text">Total {header}</p>
      </div>
    </div>
  );
};

export default Card;
