import React from 'react';

import './PitchLabel.css';

import { note } from '@tonaljs/tonal';

export function PitchLabel({ children }) {
  let pitchNames = children.split('/');

  let className = 'pitch-label' + (pitchNames.length > 1 ? ' ambiguous' : '');

  return (
    <span className={className}>
      {pitchNames.map((name, index) => (
        <SinglePitchLabel key={index}>{name}</SinglePitchLabel>
      ))}
    </span>
  );
}

function SinglePitchLabel({ children }) {
  let parse = note(children);

  let accidental = null;

  if (parse.acc === 'bb') {
    accidental = <span className="accidental double-flat">&#119083;</span>;
  } else if (parse.acc === 'b') {
    accidental = <span className="accidental flat">&#9837;</span>;
  } else if (parse.acc === '#') {
    accidental = <span className="accidental sharp">&#9839;</span>;
  } else if (parse.acc === '##') {
    accidental = <span className="accidental double-sharp">&#119082;</span>;
  }

  return (
    <span className="pitch-enharmonic">
      {parse.letter}
      {accidental}
    </span>
  );
}
