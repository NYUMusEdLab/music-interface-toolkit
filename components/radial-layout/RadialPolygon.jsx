import React, { useContext } from 'react';

import { RadialLayoutContext } from './RadialLayout.jsx';

export function RadialPolygon({ indices, radius, ...pathProps }) {
  let context = useContext(RadialLayoutContext);

  let dataParts = indices.map(
    (segmentIndex, index) =>
      `${index === 0 ? 'M' : 'L'}
       ${Math.sin(context.angles[segmentIndex].mid) * radius}
       ${-Math.cos(context.angles[segmentIndex].mid) * radius}`
  );

  let data = dataParts.join(' ') + ' Z';

  return <path {...pathProps} d={data} />;
}
