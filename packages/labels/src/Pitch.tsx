import React from 'react';

import { Accidental } from './Accidental';

type PitchProps = { step: string; alter?: number; octave?: number };

export function Pitch(props: PitchProps) {
  if ('step' in props) {
    let { step, alter, octave } = props;
    return (
      <>
        {step}
        {typeof alter === 'number' ? <Accidental alter={alter} /> : null}
        {octave}
      </>
    );
  }
}
