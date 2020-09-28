import React from 'react';
import clsx from 'clsx';

import '../fonts/Accidentals.css';
import classes from './Accidental.module.css';

type AccidentalProps = {
  /**
   * An integer describing the number of semitones the accidental adjusts
   * pitches by (eg, a sharp is +1, a double flat is -2).
   */
  alter: number;

  /**
   * An optional CSS class name
   */
  className?: string;
};

const symbols = new Map<number, string>([
  [-3, '\uED66'],
  [-2, '\uED64'],
  [-1, '\uED60'],
  [0, '\uED61'],
  [1, '\uED62'],
  [2, '\uED63'],
  [3, '\uED65'],
]);

const names = new Map<number, string>([
  [-3, 'triple flat'],
  [-2, 'double flat'],
  [-1, 'flat'],
  [0, 'natural'],
  [1, 'sharp'],
  [2, 'double sharp'],
  [3, 'triple sharp'],
]);

/**
 *
 */
export function Accidental(props: AccidentalProps) {
  const { alter, className } = props;

  if (!symbols.has(alter)) {
    throw new Error(`Unsupported accidental: alter=${alter}`);
  }

  return (
    <span className={clsx(classes.accidental, className)}>
      {symbols.get(alter)}
    </span>
  );
}

type OptionalAccProps = Omit<AccidentalProps, 'alter'>;

export function TripleFlat(props: OptionalAccProps) {
  return <Accidental {...props} alter={-3} />;
}

export function DoubleFlat(props: OptionalAccProps) {
  return <Accidental {...props} alter={-2} />;
}

export function Flat(props: OptionalAccProps) {
  return <Accidental {...props} alter={-1} />;
}

export function Natural(props: OptionalAccProps) {
  return <Accidental {...props} alter={0} />;
}

export function Sharp(props: OptionalAccProps) {
  return <Accidental {...props} alter={1} />;
}

export function DoubleSharp(props: OptionalAccProps) {
  return <Accidental {...props} alter={2} />;
}

export function TripleSharp(props: OptionalAccProps) {
  return <Accidental {...props} alter={3} />;
}
