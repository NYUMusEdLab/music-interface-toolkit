import React, { useContext } from 'react';

import { RadialLayoutContext } from './RadialLayout.jsx';

export function RadialPolygon({ indices, radius, ...pathProps }) {
  let context = useContext(RadialLayoutContext);

  indices = indices
    .filter((pointIndex, index, array) => array.indexOf(pointIndex) === index)
    .sort((a, b) => a - b);

  if (indices.length > 0) {
    let dataParts = indices.map(
      (pointIndex, index) =>
        `${index === 0 ? 'M' : 'L'}
         ${Math.sin(context.angles[pointIndex].mid) * radius}
         ${-Math.cos(context.angles[pointIndex].mid) * radius}`
    );

    let data = dataParts.join(' ') + ' Z';

    return <path {...pathProps} d={data} />;
  } else {
    return null;
  }
}
