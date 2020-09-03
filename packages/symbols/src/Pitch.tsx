import React from 'react';

import { note } from '@tonaljs/tonal';
import { midiToNoteName } from '@tonaljs/midi';

import { Accidental } from './Accidental';

type Enharmonic = 'sharp' | 'flat' | 'both';

type PitchProps = { className?: string } & (
  | { children: string }
  | {
      midi: number;
      pitchClass?: boolean;
      scale?: string[];
      enharmonic?: Enharmonic;
    }
);

export function Pitch(props: PitchProps) {
  let { className } = props;

  if ('children' in props) {
    if (typeof props.children !== 'string') {
      throw new Error(`Child of pitch label should be a pitch string`);
    }

    let parsed = note(props.children);

    if (!parsed.empty) {
      let { pc, oct } = parsed;

      return (
        <span className={className}>
          <PC>{pc}</PC>
          {oct}
        </span>
      );
    } else {
      throw new Error(`Unrecognized pitch string: ${props.children}`);
    }
  } else if ('midi' in props) {
    let { midi, pitchClass = false, scale = [], enharmonic = 'sharp' } = props;

    let oct = pitchClass ? null : Math.floor(props.midi / 12);

    for (let scalePitch of scale) {
      let parsed = note(scalePitch);

      if (!parsed.empty && parsed.chroma === midi % 12) {
        let { pc } = parsed;

        return (
          <span className={className}>
            <PC>{pc}</PC>
            {oct}
          </span>
        );
      }
    }

    if (enharmonic === 'sharp' || enharmonic === 'flat') {
      let pc = midiToNoteName(midi, {
        sharps: enharmonic === 'sharp',
        pitchClass: true,
      });

      return (
        <span className={className}>
          <PC>{pc}</PC>
          {oct}
        </span>
      );
    } else {
      let pc1 = midiToNoteName(midi, {
        sharps: true,
        pitchClass: true,
      });

      let pc2 = midiToNoteName(midi, {
        sharps: false,
        pitchClass: true,
      });

      return (
        <>
          <span className={className}>
            <PC>{pc1}</PC>
            {oct}
          </span>
          {pc1 !== pc2 ? (
            <span className={className}>
              <PC>{pc2}</PC>
              {oct}
            </span>
          ) : null}
        </>
      );
    }
  } else {
    throw new Error(
      'Pitch must either have a pitch string child or a midi value'
    );
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
