

import React from 'react';

const TextField = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextField;
