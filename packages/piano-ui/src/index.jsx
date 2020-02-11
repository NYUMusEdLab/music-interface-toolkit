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

export const Piano = ({ low = 21, high = 108, keyClass = undefined }) => {
  let blackKeys = [];
  let whiteKeys = [];

  for (let i = low; i <= high; ++i) {
    let classNames = [];
    classNames.push('piano-ui-key');
    classNames.push(
      isNatural[i % 12] ? 'piano-ui-white-key' : 'piano-ui-black-key'
    );
    let key = <div className={classNames.join(' ')} key={i} />;

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
