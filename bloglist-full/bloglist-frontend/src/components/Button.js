import React from 'react';

const Button = ({ name, handler }) => (
    <button onClick={handler}>{name}</button>
);

export default Button;