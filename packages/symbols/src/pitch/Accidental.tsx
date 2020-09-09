import React from 'react';

import '../fonts/Accidentals.css';
import styles from './Accidental.module.css';

type AccidentalProps = {
  alter: number;
};

export function Accidental({ alter }: AccidentalProps) {
  let symbol;

  if (alter === -3) {
    symbol = '\uED66';
  } else if (alter === -2) {
    symbol = '\uED64';
  } else if (alter === -1) {
    symbol = '\uED60';
  } else if (alter === 0) {
    symbol = '\uED61';
  } else if (alter === 1) {
    symbol = '\uED62';
  } else if (alter === 2) {
    symbol = '\uED63';
  } else if (alter === 3) {
    symbol = '\uED65';
  } else {
    throw new Error(`Unsuppored accidental: alter=${alter}`);
  }

  return <span className={styles.accidental}>{symbol}</span>;
}

export const TripleFlat = <Accidental alter={-3} />;
export const DoubleFlat = <Accidental alter={-2} />;
export const Flat = <Accidental alter={-1} />;
export const Natural = <Accidental alter={0} />;
export const Sharp = <Accidental alter={1} />;
export const DoubleSharp = <Accidental alter={2} />;
export const TripleSharp = <Accidental alter={3} />;
