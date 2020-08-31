import React from 'react';

import { Symbol } from './util/Symbol';

import './fonts/Accidentals.css';

type AccidentalProps = {
  alter: number;
};

export function Accidental({ alter }: AccidentalProps) {
  if (alter === -3) {
    return <Symbol>&#xED66;</Symbol>;
  } else if (alter === -2) {
    return <Symbol>&#xED64;</Symbol>;
  } else if (alter === -1) {
    return <Symbol>&#xED60;</Symbol>;
  } else if (alter === 0) {
    return <Symbol>&#xED61;</Symbol>;
  } else if (alter === 1) {
    return <Symbol>&#xED62;</Symbol>;
  } else if (alter === 2) {
    return <Symbol>&#xED63;</Symbol>;
  } else if (alter === 3) {
    return <Symbol>&#xED65;</Symbol>;
  }

  throw new Error(`Unsuppored accidental: alter=${alter}`);
}

export const TripleFlat = <Accidental alter={-3} />;
export const DoubleFlat = <Accidental alter={-2} />;
export const Flat = <Accidental alter={-1} />;
export const Natural = <Accidental alter={0} />;
export const Sharp = <Accidental alter={1} />;
export const DoubleSharp = <Accidental alter={2} />;
export const TripleSharp = <Accidental alter={3} />;
