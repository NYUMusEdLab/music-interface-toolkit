import React from 'react';

import './ScaleWheel.css';

import { note } from '@tonaljs/tonal';

import { CircleLayout, SegmentPath, SegmentLabel } from '../circle-layout/Ring';
import { Polygon } from '../circle-layout/Ring';
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
      <SegmentPath
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
      <SegmentLabel
        key={'pc-label-' + i}
        index={i}
        radius={0.39 * size}
        width={20}
        height={20}
        style={{ background: '#fff' }}
        className="note-label">
        <PitchLabel>
          {scaleChromas.includes(chroma)
            ? scale[scaleChromas.indexOf(chroma)]
            : defaultPitchNames[chroma]}
        </PitchLabel>
      </SegmentLabel>
    );

    // Scale degree label shapes
    if (scaleChromas.includes(chroma)) {
      wheelContents.push(
        <SegmentPath
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
      <Polygon
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
      <CircleLayout divisions={12}>{wheelContents}</CircleLayout>
    </svg>
  );
}
