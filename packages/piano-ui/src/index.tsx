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

type KeyClass = { [className: string]: boolean | ((key: number) => boolean) };

type PianoProps = {
  low?: number;
  high?: number;
  keyLabel?: (key: number) => React.ReactNode;
  keyClass?: KeyClass;
  onClick?: any;
  onPress?: any;
  onRelease?: any;
};

export const Piano = ({
  low = 21,
  high = 108,
  keyLabel,
  keyClass,
  onClick,
  onPress,
  onRelease,
}: PianoProps) => {
  let blackKeys = [];
  let whiteKeys = [];

  for (let i = low; i <= high; ++i) {
    let key = (
      <PianoKey key={i} value={i} keyClass={keyClass} keyLabel={keyLabel} />
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

const defaultClasses: KeyClass = {
  'piano-ui-key': true,
  'piano-ui-white-key': (key) => isNatural[key % 12],
  'piano-ui-black-key': (key) => !isNatural[key % 12],
};

type PianoKeyProps = {
  value: number;
  keyClass: PianoProps['keyClass'];
  keyLabel: PianoProps['keyLabel'];
};

function PianoKey({ value, keyClass = {}, keyLabel }: PianoKeyProps) {
  keyClass = { ...keyClass, ...defaultClasses };

  let className = Object.entries(keyClass)
    .filter(([, test]) => (typeof test === 'function' && test(value)) || test)
    .map(([name]) => name)
    .join(' ');

  return <div className={className}>{keyLabel ? keyLabel(value) : null}</div>;
}
