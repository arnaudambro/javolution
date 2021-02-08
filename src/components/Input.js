import React from 'react';

export const InputContainer = ({ children }) => <div className="input-container">{children}</div>;

const Input = ({ onChange, name, label, value, type }) => (
  <div className="input">
    <label htmlFor={label} style={{ lineHeight: '2.2em' }}>
      {label}
    </label>
    <input type={type} aria-label={name} value={value} name={name} onChange={onChange} />
  </div>
);

export default Input;
