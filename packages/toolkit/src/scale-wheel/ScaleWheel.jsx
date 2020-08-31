import React from 'react';

import './ScaleWheel.css';

import { note } from '@tonaljs/tonal';
import { getPitchInScale, getIntervalQuality } from './theory';

import {
  RadialLayout,
  SliceShape,
  SliceGroup,
  RadialPolygon,
} from '../radial-layout';

import { Pitch } from '@musedlab/symbols/pitch';

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
  'B',
];

// Constant values for representing pitch orders
export const CHROMATIC = Symbol();
export const CIRCLE_OF_FIFTHS = Symbol();

export function ScaleWheel({
  scale = [],
  size = 100,
  pitchOrder = CHROMATIC,
  activeNotes = [],
}) {
  let wheelContents = [];

  let root = scale[0] || 'C';
  let rootChroma = note(root).chroma;

  // Map active note names to pitch class chromas (eg, 'D' to 2)
  // Also, remove duplicate listings
  let activeNoteChromas = activeNotes
    .map((pitch) => note(pitch).chroma % 12)
    .filter((chroma, index, array) => array.indexOf(chroma) === index);

  for (let i = 0; i < 12; ++i) {
    let step = pitchOrder === CIRCLE_OF_FIFTHS ? 7 : 1;
    let chroma = (i * step + rootChroma) % 12;

    let pitchInScale = getPitchInScale(chroma, scale);
    let pitch = pitchInScale || defaultPitchNames[chroma];

    wheelContents.push(
      <ScaleWheelSlice
        key={i}
        index={i}
        pitch={pitch}
        root={root}
        isInScale={!!pitchInScale}
        isActive={!!getPitchInScale(chroma, activeNotes)}
        size={size}
      />
    );
  }

  if (activeNotes.length > 0) {
    let activeNoteIndices = activeNoteChromas.map(
      (chroma) =>
        ((chroma - rootChroma + 12) *
          (pitchOrder === CIRCLE_OF_FIFTHS ? 7 : 1)) %
        12
    );

    wheelContents.push(
      <g className="active-pitches" key="active-pitches">
        {activeNoteIndices.map((index) => (
          <SliceShape
            key={'active-shape-' + index}
            index={index}
            innerRadius={0.3 * size}
            outerRadius={0.475 * size}
            className="slice"
            stroke="#000"
            strokeWidth={3}
            fill="none"
          />
        ))}
        <RadialPolygon
          key={'active-polygon'}
          className="polygon"
          indices={activeNoteIndices}
          radius={0.25 * size}
          stroke="#000"
          strokeWidth={3}
          fill="none"
        />
      </g>
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

function ScaleWheelSlice({ index, pitch, root, isInScale, isActive, size }) {
  let classList = ['pitch-slice'];

  if (isInScale) {
    classList.push(getIntervalQuality(root, pitch));
  }

  if (isActive) {
    classList.push('active');
  }

  return (
    <g className={classList.join(' ')}>
      <SliceShape
        index={index}
        innerRadius={0.3 * size}
        outerRadius={0.475 * size}
        stroke="#000"
        fill="#fff"
        className="pitch-shape"
      />
      <SliceGroup index={index} radius={0.39 * size} scale={(size * 0.13) / 20}>
        <foreignObject width={24} height={20} x={-12} y={-10}>
          <Pitch>{pitch}</Pitch>
        </foreignObject>
      </SliceGroup>
      {isInScale ? (
        <>
          <SliceShape
            index={index}
            innerRadius={0.2 * size}
            outerRadius={0.3 * size}
            stroke="#000"
            fill="#fff"
          />
          <SliceGroup
            index={index}
            radius={0.25 * size}
            scale={(size * 0.13) / 20}>
            <foreignObject width={24} height={20} x={-12} y={-10}>
              {/* <Pitch>{pitch}</Pitch> */}
            </foreignObject>
          </SliceGroup>
        </>
      ) : null}
    </g>
  );
}
