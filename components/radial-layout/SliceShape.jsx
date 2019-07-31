import React, { useContext } from 'react';

import { RadialLayoutContext } from './RadialLayout.jsx';

export function SliceShape({ index, outerRad, innerRad, ...pathProps }) {
  let context = useContext(RadialLayoutContext);

  let { start, end } = context.angles[index];

  let data = `M ${Math.sin(start) * outerRad} ${-Math.cos(start) * outerRad}
              A ${outerRad} ${outerRad} 0 0 1
                ${Math.sin(end) * outerRad} ${-Math.cos(end) * outerRad}
              L ${Math.sin(end) * innerRad} ${-Math.cos(end) * innerRad}
              A ${innerRad} ${innerRad} 0 0 0
                ${Math.sin(start) * innerRad} ${-Math.cos(start) * innerRad} Z`;

  return <path {...pathProps} d={data} />;
}
