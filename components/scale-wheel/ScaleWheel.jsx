import React from 'react';

import './ScaleWheel.css';

import { note } from '@tonaljs/tonal';

import {
  RadialLayout,
  SliceShape,
  SliceGroup,
  RadialPolygon
} from '../radial-layout';

import { PitchLabel } from '../labels';

const defaultPitchNames = [
  'C',
  'C#/Db',
  'D',
  'D#/Eb',
  'E',
  'F',
  'F#/Gb',
  'G',
  'G#/Ab',
  'A',
  'A#/Bb',
  'B'
];

const noteTypes = [
  'perfect',
  'minor',
  'major',
  'minor',
  'major',
  'perfect',
  'minor',
  'perfect',
  'minor',
  'major',
  'minor',
  'major'
];

export function ScaleWheel({
  scale = [],
  size = 100,
  pitchOrder = 'chromatic',
  activeNotes
}) {
  let wheelContents = [];

  let scaleChromas = scale.map(pitch => note(pitch).chroma);

  for (let i = 0; i < 12; ++i) {
    let chroma =
      (i * (pitchOrder === 'fifths' ? 7 : 1) + (scaleChromas[0] || 0)) % 12;

    // Main label shapes
    wheelContents.push(
      <SliceShape
        key={'pc-shape-' + i}
        index={i}
        innerRad={0.3 * size}
        outerRad={0.475 * size}
        className={
          'note-wedge ' +
          (scaleChromas.includes(chroma) ? noteTypes[i] : 'skip')
        }
        stroke="#000"
        fill="#fff"
      />
    );

    // Label
    wheelContents.push(
      <SliceGroup
        key={'pc-label-' + i}
        index={i}
        radius={0.39 * size}
        scale={4}>
        <foreignObject width={20} height={20} x={-10} y={-10}>
          <PitchLabel>
            {scaleChromas.includes(chroma)
              ? scale[scaleChromas.indexOf(chroma)]
              : defaultPitchNames[chroma]}
          </PitchLabel>
        </foreignObject>
      </SliceGroup>
    );

    // Scale degree label shapes
    if (scaleChromas.includes(chroma)) {
      wheelContents.push(
        <SliceShape
          key={'sd-shape-' + i}
          index={i}
          innerRad={0.2 * size}
          outerRad={0.3 * size}
          className={noteTypes[i]}
          fill="#fff"
          stroke="#000"
        />
      );
    }
  }

  if (activeNotes) {
    wheelContents.push(
      <RadialPolygon
        indices={scaleChromas.map(
          chroma => (chroma + (12 - scaleChromas[0])) % 12
        )}
        radius={25}
        stroke="rgb(255, 0, 255)"
        fill="rgba(255, 0, 255, 0.4)"
      />
    );
  }

  return (
    <svg
      className="pitch-wheel"
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      <RadialLayout divisions={12}>{wheelContents}</RadialLayout>
    </svg>
  );
}
