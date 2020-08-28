import React from 'react';

import { Symbol } from './util/Symbol';

import '../fonts/Accidentals.css';

type AccidentalProps = {
  alter: number;
};

export function Accidental({ alter }: AccidentalProps) {
  if (alter === -2) {
    return <Symbol>&#119083;</Symbol>;
  } else if (alter === -1) {
    return <Symbol>&#9837;</Symbol>;
  } else if (alter === 0) {
    return <Symbol>&#9838;</Symbol>;
  } else if (alter === 1) {
    return <Symbol>&#9839;</Symbol>;
  } else if (alter === 2) {
    return <Symbol>&#119082;</Symbol>;
  }

  throw new Error(`Unsuppored accidental: alter=${alter}`);
}
