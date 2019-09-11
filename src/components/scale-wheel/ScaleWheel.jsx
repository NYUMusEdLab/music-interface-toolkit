import React from 'react';

import './ScaleWheel.css';

import { note, interval, distance } from '@tonaljs/tonal';

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

// Constant values for representing pitch orders
export const CHROMATIC = Symbol();
export const CIRCLE_OF_FIFTHS = Symbol();

export function ScaleWheel({
  scale = [],
  size = 100,
  pitchOrder = CHROMATIC,
  activeNotes = []
}) {
  let wheelContents = [];

  let scaleChromas = scale.map(pitch => note(pitch).chroma);

  // Map active note names to pitch class chromas (eg, 'D' to 2)
  // Also, remove duplicate listings
  let activeNoteChromas = activeNotes
    .map(pitch => note(pitch).chroma % 12)
    .filter((chroma, index, array) => array.indexOf(chroma) === index);

  for (let i = 0; i < 12; ++i) {
    let chroma =
      (i * (pitchOrder === CIRCLE_OF_FIFTHS ? 7 : 1) + (scaleChromas[0] || 0)) %
      12;

    // Main label shapes
    wheelContents.push(
      <SliceShape
        key={'pc-shape-' + i}
        index={i}
        innerRadius={0.3 * size}
        outerRadius={0.475 * size}
        className={
          'note-wedge' +
          (scaleChromas.includes(chroma) ? ' ' + noteTypes[i] : '') +
          (activeNoteChromas.includes(chroma) ? ' active' : '')
        }
        stroke="#000"
        fill="#fff"
      />
    );

    if (scaleChromas.includes(chroma)) {
      getIntervalQuality('C', 'F');
    }

    // Label
    wheelContents.push(
      <SliceGroup
        key={'pc-label-' + i}
        index={i}
        radius={0.39 * size}
        scale={(size * 0.13) / 20}>
        <foreignObject
          width={24}
          height={20}
          x={-12}
          y={-10}
          className={
            (scaleChromas.includes(chroma) ? 'in-scale ' : '') +
            (activeNoteChromas.includes(chroma) ? 'active' : '')
          }>
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
          innerRadius={0.2 * size}
          outerRadius={0.3 * size}
          className={noteTypes[i]}
          fill="#FFF"
          stroke="#000"
        />
      );
    }
  }

  if (activeNotes.length > 0) {
    let activeNoteIndices = activeNoteChromas.map(
      chroma => (chroma - scaleChromas[0] + 12) % 12
    );

    for (let index of activeNoteIndices) {
      wheelContents.push(
        <SliceShape
          key={'active-shape-' + index}
          index={index}
          innerRadius={0.3 * size}
          outerRadius={0.475 * size}
          stroke="#000"
          strokeWidth={3}
          fill="none"
        />
      );
    }

    wheelContents.push(
      <RadialPolygon
        key={'active-polygon'}
        indices={activeNoteIndices}
        radius={0.25 * size}
        stroke="#000"
        strokeWidth={3}
        fill="none"
      />
    );
  }

  return (
    <svg
      className="scale-wheel"
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      <RadialLayout divisions={12}>{wheelContents}</RadialLayout>
    </svg>
  );
}

function getIntervalQuality(root, scalePitch) {
  switch (interval(distance(root, scalePitch)).q) {
    case 'dd':
      return 'double-diminished';
    case 'd':
      return 'diminished';
    case 'm':
      return 'minor';
    case 'P':
      return 'perfect';
    case 'M':
      return 'major';
    case 'A':
      return 'augmented';
    case 'AA':
      return 'double-augmented';
  }
}
