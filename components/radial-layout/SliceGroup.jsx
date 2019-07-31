import React, { useContext } from 'react';

import { RadialLayoutContext } from './RadialLayout.jsx';

export function SliceGroup({ index, radius, scale = 1, children }) {
  let context = useContext(RadialLayoutContext);

  let { mid } = context.angles[index];
  let transform = `translate(${Math.sin(mid) * radius},
                             ${-Math.cos(mid) * radius})
                   scale(${scale})`;

  return <g transform={transform}>{children}</g>;
}
