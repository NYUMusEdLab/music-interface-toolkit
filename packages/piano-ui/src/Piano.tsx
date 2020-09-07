import React from 'react';
import clsx from 'clsx';

import { ButtonGroup, useButtonHandlers } from './ButtonGroup';

import Layout from './css/Layout.module.css';
import DefaultTheme from './css/DefaultTheme.module.css';

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

type KeyClass = {
  [className: string]: boolean | ((key: number) => boolean) | number | number[];
};

type PianoKeyEvent = {
  key: number;
  event: React.MouseEvent | React.PointerEvent;
};

type PianoProps = {
  low?: number;
  high?: number;
  active?: number | number[];
  theme?: { [className: string]: string };
  keyLabel?: (key: number) => React.ReactNode;
  keyClass?: KeyClass;
  onClick?: (event: PianoKeyEvent) => any;
  onPress?: (event: PianoKeyEvent) => any;
  onRelease?: (event: PianoKeyEvent) => any;
};

export const Piano = ({
  low = 21,
  high = 108,
  active,
  theme = DefaultTheme,
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
        active={active}
        theme={theme}
        keyClass={keyClass}
        keyLabel={keyLabel}
        onClick={onClick}
        onPress={onPress}
        onRelease={onRelease}
      />
    );

    if (isNatural[i % 12]) {
      whiteKeys.push(key);
      blackKeys.push(<div className={clsx(Layout.gap, theme.gap)} key={i} />);
    } else {
      if (i === low || i === high) {
        whiteKeys.push(<div className={clsx(Layout.gap, theme.gap)} key={i} />);
      }
      blackKeys.push(key);
    }
  }

  return (
    <div className={clsx(Layout.piano, theme.piano)}>
      <ButtonGroup>
        <div>{blackKeys}</div>
        <div>{whiteKeys}</div>
      </ButtonGroup>
    </div>
  );
};

type PianoKeyProps = {
  value: number;
  active: PianoProps['active'];
  theme: { [className: string]: string };
  keyClass: PianoProps['keyClass'];
  keyLabel: PianoProps['keyLabel'];
  onClick: PianoProps['onClick'];
  onPress: PianoProps['onPress'];
  onRelease: PianoProps['onRelease'];
};

function PianoKey({
  value,
  active,
  theme,
  keyClass = {},
  keyLabel,
  onClick,
  onPress,
  onRelease,
}: PianoKeyProps) {
  let themeClasses = [
    'key',
    `key-${value % 12}`,
    `key-${isNatural[value % 12] ? 'white' : 'black'}`,
  ];

  let className = clsx(
    themeClasses.map((c) => Layout[c]),
    themeClasses.map((c) => theme[c]),
    active !== undefined &&
      theme['key-active'] &&
      evaluateKeyClasses({ [theme['key-active']]: active }, value),
    evaluateKeyClasses(keyClass, value)
  );

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

function evaluateKeyClasses(classes: KeyClass, key: number) {
  return Object.entries(classes).reduce<{ [className: string]: boolean }>(
    (newClasses, [name, value]) => {
      if (typeof value === 'number') {
        newClasses[name] = value === key;
      } else if (Array.isArray(value)) {
        newClasses[name] = value.includes(key);
      } else if (typeof value === 'function') {
        newClasses[name] = value(key);
      } else {
        newClasses[name] = value;
      }

      return newClasses;
    },
    {}
  );
}
