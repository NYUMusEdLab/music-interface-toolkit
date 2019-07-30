import React from 'react';

import { note } from '@tonaljs/tonal';

import { CircleLayout, SegmentPath, SegmentLabel } from '../circle-layout/Ring';
import { Polygon } from '../circle-layout/Ring';
import { PitchName } from '../labels/PitchLabel';

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

export function ScaleWheel({ scale = [], size = 100, activeNotes }) {
  let wheelContents = [];

  let scaleChromas = scale.map(pitch => note(pitch).chroma);

  for (let i = 0; i < 12; ++i) {
    let chroma = (i + (scaleChromas[0] || 0)) % 12;

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
        strokeWidth={1}
        stroke="#FFF"
      />
    );

    // Label
    wheelContents.push(
      <SegmentLabel
        key={'pc-label-' + i}
        index={i}
        radius={0.39 * size}
        className="note-label">
        {scaleChromas.includes(chroma) ? (
          <PitchName>{scale[scaleChromas.indexOf(chroma)]}</PitchName>
        ) : (
          defaultPitchNames[chroma]
        )}
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
          strokeWidth={1}
          stroke="#FFF"
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
      className="scale-wheel"
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      <CircleLayout divisions={12}>{wheelContents}</CircleLayout>
    </svg>
  );
}
