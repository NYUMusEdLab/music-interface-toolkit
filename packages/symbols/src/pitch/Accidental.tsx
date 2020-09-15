import React from 'react';
import clsx from 'clsx';

import '../fonts/Accidentals.css';
import styles from './Accidental.module.css';

type AccidentalProps = {
  className?: string;

  /**
   * An integer describing the number of semitones the accidental adjusts
   * pitches by (eg, a sharp is +1, a double flat is -2).
   */
  alter: number;
};

const symbols: { [alter: number]: string } = {
  [-3]: '\uED66',
  [-2]: '\uED64',
  [-1]: '\uED60',
  [0]: '\uED61',
  [1]: '\uED62',
  [2]: '\uED63',
  [3]: '\uED65',
};

const names: { [alter: number]: string } = {
  [-3]: 'triple flat',
  [-2]: 'double flat',
  [-1]: 'flat',
  [0]: 'natural',
  [1]: 'sharp',
  [2]: 'double sharp',
  [3]: 'triple sharp',
};

/**
 *
 * @param props
 */
export function Accidental({ className, alter }: AccidentalProps) {
  if (alter in symbols) {
    return (
      <span className={clsx(styles.accidental, className)}>
        {symbols[alter]}
      </span>
    );
  } else {
    throw new Error(`Unsuppored accidental: alter=${alter}`);
  }
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
