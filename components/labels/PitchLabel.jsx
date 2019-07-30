import React from 'react';

import { note } from '@tonaljs/tonal';

export function PitchName({ children }) {
  let parse = note(children);

  let accidental = null;

  if (parse.acc === 'bb') {
    accidental = <span className="accidental">&#119083;</span>;
  } else if (parse.acc === 'b') {
    accidental = <span className="accidental">&#9837;</span>;
  } else if (parse.acc === '#') {
    accidental = <span className="accidental">&#9839;</span>;
  } else if (parse.acc === '##') {
    accidental = <span className="accidental">&#119082;</span>;
  }

  return (
    <span className="note">
      {parse.letter}
      {accidental}
    </span>
  );
}
