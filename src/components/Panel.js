// Panel.js

import React from 'react';

const Panel = ({ title, children }) => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">{title}</h3>
      </div>
      <div className="panel-body">
        {children}
      </div>
    </div>
  );
};

export default Panel;
