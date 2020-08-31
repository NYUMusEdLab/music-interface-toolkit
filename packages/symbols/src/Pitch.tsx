import React from 'react';

import { note } from '@tonaljs/tonal';
import { midiToNoteName } from '@tonaljs/midi';

import { Accidental } from './Accidental';

type Enharmonic = 'sharp' | 'flat' | 'both';

type PitchProps =
  | { children: string }
  | { midi: number; scale?: string[]; enharmonic?: Enharmonic }
  | { pitchClass: number; scale?: string[]; enharmonic?: Enharmonic };

export function Pitch(props: PitchProps) {
  if ('children' in props) {
    if (typeof props.children !== 'string') {
      throw new Error(`Child of pitch label should be a pitch string`);
    }

    let parsed = note(props.children);

    if (!parsed.empty) {
      let { pc, oct } = parsed;

      return (
        <span>
          <PC>{pc}</PC>
          {oct}
        </span>
      );
    } else {
      throw new Error(`Unrecognized pitch string: ${props.children}`);
    }
  } else if ('midi' in props || 'pitchClass' in props) {
    let { scale = [], enharmonic = 'sharp' } = props;

    let pitchClass = ('midi' in props ? props.midi : props.pitchClass) % 12;
    let oct = 'midi' in props ? Math.floor(props.midi / 12) : null;

    for (let scalePitch of scale) {
      let parsed = note(scalePitch);

      if (!parsed.empty && parsed.chroma === pitchClass) {
        let { pc } = parsed;

        return (
          <span>
            <PC>{pc}</PC>
            {oct}
          </span>
        );
      }
    }

    if (enharmonic === 'sharp' || enharmonic === 'flat') {
      let pc = midiToNoteName(pitchClass, {
        sharps: enharmonic === 'sharp',
        pitchClass: true,
      });

      return (
        <span>
          <PC>{pc}</PC>
          {oct}
        </span>
      );
    } else {
      let pc1 = midiToNoteName(pitchClass, {
        sharps: true,
        pitchClass: true,
      });

      let pc2 = midiToNoteName(pitchClass, {
        sharps: true,
        pitchClass: true,
      });

      return (
        <>
          <span>
            <PC>{pc1}</PC>
            {oct}
          </span>
          {pc1 !== pc2 ? (
            <span>
              <PC>{pc2}</PC>
              {oct}
            </span>
          ) : null}
        </>
      );
    }
  } else {
    throw new Error();
  }
}

function PC({ children }: { children: string }) {
  let pitch = note(children);

  if (pitch.empty) {
    throw new Error(); // This shouldn't ever happen
  }

  let { letter, alt } = pitch;

  if (alt < -3 || alt > 3) {
    let pitchName = letter + (alt > 0 ? '#'.repeat(alt) : 'b'.repeat(-alt));
    throw new Error(`Pitch ${pitchName} has too many accidentals`);
  }

  return (
    <>
      {letter}
      {alt !== 0 ? <Accidental alter={alt} /> : null}
    </>
  );
}
