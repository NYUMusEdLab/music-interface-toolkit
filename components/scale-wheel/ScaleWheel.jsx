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
  activeNotes = [],
  stroke = '#000',
  strokeWidth = 1,
  fill = '#fff'
}) {
  let wheelContents = [];

  let scaleChromas = scale.map(pitch => note(pitch).chroma);

  // Map active note names to pitch class chromas (eg, 'D' to 2)
  // Also, remove duplicate listings
  let activeNoteChromas = activeNotes
    .map(pitch => (note(pitch).chroma + scaleChromas[0]) % 12)
    .filter((chroma, index, array) => array.indexOf(chroma) === index);

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
          'note-wedge' +
          (scaleChromas.includes(chroma) ? ' ' + noteTypes[i] : '') +
          (activeNoteChromas.includes(chroma) ? ' active' : '')
        }
        stroke={stroke}
        fill={fill}
        strokeWidth={strokeWidth}
      />
    );

    // Label
    wheelContents.push(
      <SliceGroup
        key={'pc-label-' + i}
        index={i}
        radius={0.39 * size}
        scale={(size * 0.13) / 20}>
        <foreignObject
          width={20}
          height={20}
          x={-10}
          y={-10}
          className={scaleChromas.includes(chroma) ? 'in-scale' : ''}>
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
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }
  }

  if (activeNotes.length > 0) {
    for (let chroma of activeNoteChromas) {
      wheelContents.push(
        <SliceShape
          key={'active-shape-' + chroma}
          index={chroma}
          innerRad={0.3 * size}
          outerRad={0.475 * size}
          stroke="rgb(255, 0, 255)"
          strokeWidth={5}
          fill="none"
        />
      );
    }

    wheelContents.push(
      <RadialPolygon
        key={'active-polygon'}
        indices={activeNoteChromas}
        radius={0.25 * size}
        strokeWidth={5}
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
