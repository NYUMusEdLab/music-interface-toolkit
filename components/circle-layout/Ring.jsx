import React, { createContext, useContext } from 'react';

export const CircleLayoutContext = createContext(null);

export function CircleLayout({ divisions, children }) {
  let segmentAngle = (Math.PI * 2) / divisions;

  let angles = [];

  for (let i = 0; i < divisions; ++i) {
    angles.push({
      start: (i - 0.5) * segmentAngle,
      mid: i * segmentAngle,
      end: (i + 0.5) * segmentAngle
    });
  }

  return (
    <CircleLayoutContext.Provider value={{ angles }}>
      {children}
    </CircleLayoutContext.Provider>
  );
}

export function SegmentPath({ index, outerRad, innerRad, ...pathProps }) {
  let context = useContext(CircleLayoutContext);

  let { start, end } = context.angles[index];

  let data = `M ${Math.sin(start) * outerRad} ${-Math.cos(start) * outerRad}
              A ${outerRad} ${outerRad} 0 0 1
                ${Math.sin(end) * outerRad} ${-Math.cos(end) * outerRad}
              L ${Math.sin(end) * innerRad} ${-Math.cos(end) * innerRad}
              A ${innerRad} ${innerRad} 0 0 0
                ${Math.sin(start) * innerRad} ${-Math.cos(start) * innerRad} Z`;

  return <path {...pathProps} d={data} />;
}

export function SegmentLabel({ index, radius, children, className }) {
  let context = useContext(CircleLayoutContext);

  let { mid } = context.angles[index];

  return (
    <foreignObject
      className={className}
      width={20}
      height={20}
      x={Math.sin(mid) * radius - 10}
      y={-Math.cos(mid) * radius - 10}>
      {children}
    </foreignObject>
  );
}

export function Polygon({ indices, radius, ...pathProps }) {
  let context = useContext(CircleLayoutContext);

  let dataParts = indices.map(
    (segmentIndex, index) =>
      `${index === 0 ? 'M' : 'L'}
       ${Math.sin(context.angles[segmentIndex].mid) * radius}
       ${-Math.cos(context.angles[segmentIndex].mid) * radius}`
  );

  let data = dataParts.join(' ') + ' Z';

  return <path {...pathProps} d={data} />;
}
