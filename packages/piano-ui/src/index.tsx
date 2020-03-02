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

interface PianoProps {
  low?: number;
  high?: number;
  keyClass?: (key: number) => string[];
  onPress?: any;
  onRelease?: any;
}

export const Piano = ({
  low = 21,
  high = 108,
  keyClass,
  onPress,
  onRelease
}: PianoProps) => {
  let blackKeys = [];
  let whiteKeys = [];

  for (let i = low; i <= high; ++i) {
    let classNames = [];
    classNames.push('piano-ui-key');
    classNames.push(
      isNatural[i % 12] ? 'piano-ui-white-key' : 'piano-ui-black-key'
    );
    if (keyClass) {
      classNames.push(...keyClass(i));
    }
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

function Key({}) {
  return (
    <div
      onContextMenu={event => {
        event.preventDefault();
      }}
      onPointerDown={() => {
        // console.log('pointer down');
        activate(note);
        setActive(true);
      }}
      onPointerOver={event => {
        // console.log('pointer over');
        // console.log(event.pointerType);
        activate(note);
        setActive(true);
      }}
      onPointerOut={() => {
        // console.log('pointer out');
        deactivate(note);
        setActive(false);
      }}
      onPointerCancel={() => {
        // console.log('pointer cancel');
        deactivate(note);
        setActive(false);
      }}
      onGotPointerCapture={event => {
        // console.log('pointer capture');
        event.target.releasePointerCapture(event.pointerId);
      }}>
      {note}
    </div>
  );
}
