import React from 'react';

import { Accidental } from './Accidental';

const PitchExpression = /^([A-Ga-g])(?:(#{1,3})|(b{1,3}))?(-?\d+)?$/;

type PitchProps = { children: string };

export function Pitch(props: PitchProps) {
  let step, accidental, octave;

  if ('children' in props) {
    if (typeof props.children !== 'string') {
      throw new Error(`Child of pitch label should be a pitch string`);
    }

    let { children } = props;
    let match = children.match(PitchExpression);

    if (match) {
      let sharps, flats, octaveString;
      [, step, sharps = '', flats = '', octaveString = ''] = match;

      if (sharps.length > 0 || flats.length > 0) {
        accidental = <Accidental alter={sharps.length - flats.length} />;
      } else {
        accidental = null;
      }

      octave = octaveString === '' ? null : parseInt(octaveString);
    } else {
      throw new Error(`Unrecognized pitch string: ${children}`);
    }
  }

  return (
    <>
      {step}
      {accidental}
      {octave}
    </>
  );
}
