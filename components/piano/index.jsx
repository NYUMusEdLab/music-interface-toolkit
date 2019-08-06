import React from 'react';

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

export const PianoKeyboard = ({ highlighted }) => {
  let blackKeys = [];
  let whiteKeys = [];

  highlighted = highlighted || [];

  for (let i = 21; i <= 108; ++i) {
    let className = 'key' + (highlighted.includes(i) ? ' highlighted' : '');
    let key = <div className={className} key={i} />;

    if (isNatural[i % 12]) {
      whiteKeys.push(key);
      blackKeys.push(<div className="gap" key={i} />);
    } else {
      blackKeys.push(key);
    }
  }

  return (
    <div className="piano-keyboard">
      <div className="row black-row">{blackKeys}</div>
      <div className="row white-row">{whiteKeys}</div>
    </div>
  );
};
