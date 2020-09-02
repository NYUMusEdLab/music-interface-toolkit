import React, { useContext } from 'react';

import { RadialLayoutContext } from './RadialLayout.jsx';

export function SliceShape({
  index,
  outerRadius: r1,
  innerRadius: r2,
  ...pathProps
}) {
  let context = useContext(RadialLayoutContext);

  let { start: a1, end: a2 } = context.angles[index];

  /*
  a1 & a2: starting and ending angles for the shape
  r1 & r2: outer and inner radii for the shape
  
  M: Move to point
  A: Arc to point
  Z: Close shape
  */
  let data = `M ${Math.sin(a1) * r1} ${-Math.cos(a1) * r1}
              A ${r1} ${r1} 0 0 1 ${Math.sin(a2) * r1} ${-Math.cos(a2) * r1}
              L ${Math.sin(a2) * r2} ${-Math.cos(a2) * r2}
              A ${r2} ${r2} 0 0 0 ${Math.sin(a1) * r2} ${-Math.cos(a1) * r2}
              Z`;

  // Clean up excess white space
  data = data.replace(/\s+/g, ' ');

  return <path {...pathProps} d={data} />;
}
