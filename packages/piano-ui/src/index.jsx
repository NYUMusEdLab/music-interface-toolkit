import React from 'react';

import './style.css';

const isNatural = [
  true,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  true
];

export const PianoKeyboard = ({
  low = 21,
  high = 108,
  keyClass = undefined
}) => {
  let blackKeys = [];
  let whiteKeys = [];

  for (let i = low; i <= high; ++i) {
    let className = 'piano-ui-key';
    let key = <div className={className} key={i} />;

    if (isNatural[i % 12]) {
      whiteKeys.push(key);
      blackKeys.push(<div className="piano-ui-gap" key={i} />);
    } else {
      blackKeys.push(key);
    }
  }

  return (
    <div className="piano-ui">
      <div>{blackKeys}</div>
      <div>{whiteKeys}</div>
    </div>
  );
};
