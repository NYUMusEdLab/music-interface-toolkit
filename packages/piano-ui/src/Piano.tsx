import React from 'react';

import { ButtonGroup, useButtonHandlers } from './ButtonGroup';

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

type PianoKeyEvent = {
  key: number;
  event: React.MouseEvent | React.PointerEvent;
};

type PianoProps = {
  low?: number;
  high?: number;
  keyLabel?: (key: number) => React.ReactNode;
  keyClass?: KeyClass;
  onClick?: (event: PianoKeyEvent) => any;
  onPress?: (event: PianoKeyEvent) => any;
  onRelease?: (event: PianoKeyEvent) => any;
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
      <PianoKey
        key={i}
        value={i}
        keyClass={keyClass}
        keyLabel={keyLabel}
        onClick={onClick}
        onPress={onPress}
        onRelease={onRelease}
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
      <ButtonGroup>
        <div>{blackKeys}</div>
        <div>{whiteKeys}</div>
      </ButtonGroup>
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
  onClick: PianoProps['onClick'];
  onPress: PianoProps['onPress'];
  onRelease: PianoProps['onRelease'];
};

function PianoKey({
  value,
  keyClass = {},
  keyLabel,
  onClick,
  onPress,
  onRelease,
}: PianoKeyProps) {
  // Derive className string from provided classes
  keyClass = { ...keyClass, ...defaultClasses };

  let className = Object.entries(keyClass)
    .filter(([, test]) => (typeof test === 'function' ? test(value) : test))
    .map(([name]) => name)
    .join(' ');

  // Add event handlers

  // On Click
  let handleClick;
  if (onClick) {
    handleClick = (event: React.MouseEvent) => {
      onClick({ key: value, event });
    };
  }

  // On Press
  let pointerHandlers = useButtonHandlers(
    (event) => {
      if (onPress) {
        onPress({ key: value, event });
      }
    },
    (event) => {
      if (onRelease) {
        onRelease({ key: value, event });
      }
    },
    [onPress, onRelease, value]
  );

  return (
    <div className={className} onClick={handleClick} {...pointerHandlers}>
      {keyLabel ? keyLabel(value) : null}
    </div>
  );
}
