import React from 'react';

import { note } from '@tonaljs/tonal';
import { getPitchInScale, getIntervalQuality } from './theory';

import { RadialLayout, SliceShape } from '../radial-layout';

export function ScaleIcon({ scale }) {
  let segments = [];

  let root = scale[0] || 'C';
  let scaleDegrees = scale.map((pitch) => note(pitch).chroma);

  for (let i = 0; i < 12; ++i) {
    let chroma = (i + note(root).chroma) % 12;
    let pitchInScale = getPitchInScale(chroma, scale);

    let className = 'pitch-slice';

    if (!!pitchInScale) {
      className += ` ${getIntervalQuality(root, pitchInScale)}`;
    }

    segments.push(
      <g key={i} className={className}>
        <SliceShape
          index={i}
          innerRadius={scaleDegrees.includes(i) ? 20 : 35}
          outerRadius={49}
        />
      </g>
    );
  }

  return (
    <svg
      className="scale-wheel scale-icon"
      width={100}
      height={100}
      viewBox="-50 -50 100 100">
      <RadialLayout divisions={12}>{segments}</RadialLayout>
    </svg>
  );
}
