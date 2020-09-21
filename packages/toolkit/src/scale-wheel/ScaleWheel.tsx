import React from 'react';
import clsx from 'clsx';

import { note } from '@tonaljs/core';
import { scaleNotes } from '@tonaljs/scale';

import { getIntervalQuality, getChromaMap } from './theory';

import {
  RadialLayout,
  SliceShape,
  SliceGroup,
  RadialPolygon,
  // @ts-ignore: TODO: Re-write radial UI library in TS
} from '../radial-layout';

import { Pitch, Accidental } from '@musedlab/symbols/pitch';

import Classes from './ScaleWheel.module.css';

// Constant values for representing pitch orders
export const CHROMATIC = Symbol();
export const CIRCLE_OF_FIFTHS = Symbol();

type ScaleWheelProps = {
  scale: string[];
  size: number;
  pitchOrder: typeof CHROMATIC | typeof CIRCLE_OF_FIFTHS;
  activeNotes: string[];
  className: string;
};

export function ScaleWheel({
  scale = [],
  size = 100,
  pitchOrder = CHROMATIC,
  activeNotes = [],
  className = '',
}: ScaleWheelProps) {
  // Normalize scale
  scale = scaleNotes(scale);

  // Get a mapping of the pitch classes in the scale to the pitch name
  const scaleChromas = getChromaMap(scale);

  let wheelContents = [];

  let root = scale[0] || 'C';
  let rootChroma = note(root).chroma || 0;

  const activeChromas = getChromaMap(activeNotes);

  const step = pitchOrder === CIRCLE_OF_FIFTHS ? 7 : 1;

  for (let i = 0; i < 12; ++i) {
    let chroma = (i * step + rootChroma) % 12;

    wheelContents.push(
      <g
        className={clsx(
          'pitch-slice',
          chroma in scaleChromas &&
            getIntervalQuality(root, scaleChromas[chroma]),
          chroma in activeChromas && 'active'
        )}
        key={chroma}>
        <SliceShape
          index={i}
          innerRadius={0.3 * size}
          outerRadius={0.475 * size}
          stroke="#000"
          fill="#fff"
          className="pitch-shape"
        />
        <SliceGroup index={i} radius={0.39 * size} scale={(size * 0.13) / 20}>
          <foreignObject
            className={Classes.label}
            width={24}
            height={20}
            x={-12}
            y={-10}>
            <Pitch midi={chroma} pitchClass scale={scale} enharmonic="both" />
          </foreignObject>
        </SliceGroup>
        {chroma in scaleChromas && (
          <>
            <SliceShape
              index={i}
              innerRadius={0.2 * size}
              outerRadius={0.3 * size}
              stroke="#000"
              fill="#fff"
            />
            <SliceGroup
              index={i}
              radius={0.25 * size}
              scale={(size * 0.1) / 20}>
              <foreignObject
                className={Classes.label}
                width={24}
                height={20}
                x={-12}
                y={-10}>
                <ScaleDegree pitch={scaleChromas[chroma]} root={root} />
              </foreignObject>
            </SliceGroup>
          </>
        )}
      </g>
    );
  }

  if (activeNotes.length > 0) {
    let activeNoteIndices = Object.keys(activeChromas).map(
      (chroma) =>
        ((parseInt(chroma) - rootChroma + 12) *
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
      className={'scale-wheel ' + className}
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      <RadialLayout divisions={12}>{wheelContents}</RadialLayout>
    </svg>
  );
}

import { interval, distance } from '@tonaljs/core';

type ScaleDegreeProps = {
  pitch: string;
  root: string;
};

function ScaleDegree({ pitch, root }: ScaleDegreeProps) {
  let { alt, simple } = interval(distance(root, pitch));

  return (
    <span className={Classes['scale-degree']}>
      {alt ? <Accidental alter={alt} theme={Classes} /> : null}
      <span
        className={clsx(
          Classes[`pitch-class-${simple}` as keyof typeof Classes]
        )}>
        {simple}
      </span>
    </span>
  );
}
