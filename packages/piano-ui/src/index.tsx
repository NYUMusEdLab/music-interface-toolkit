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
  true,
];

type PianoProps = {
  low?: number;
  high?: number;
  keyClass?: (key: number) => undefined | string | string[];
  onPress?: any;
  onRelease?: any;
};

export const Piano = ({ low = 21, high = 108, keyClass }: PianoProps) => {
  let blackKeys = [];
  let whiteKeys = [];

  for (let i = low; i <= high; ++i) {
    let classNames = [];
    classNames.push('piano-ui-key');
    classNames.push(
      isNatural[i % 12] ? 'piano-ui-white-key' : 'piano-ui-black-key'
    );

    if (keyClass) {
      let customClasses = keyClass(i);

      if (customClasses) {
        if (typeof customClasses === 'string') {
          classNames.push(customClasses);
        } else {
          classNames.push(...customClasses);
        }
      }
    }

    let key = (
      <div
        className={classNames.join(' ')}
        key={i}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
        onPointerDown={() => {
          console.log('pointer down');
        }}
        onPointerOver={(event) => {
          console.log('pointer over');
        }}
        onPointerOut={() => {
          console.log('pointer out');
        }}
        onPointerCancel={() => {
          console.log('pointer cancel');
        }}
        onGotPointerCapture={(event) => {
          console.log('pointer capture');
        }}
      />
    );

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
