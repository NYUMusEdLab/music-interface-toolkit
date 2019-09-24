import React, { createContext } from 'react';

export const RadialLayoutContext = createContext(null);

export function RadialLayout({ divisions, children }) {
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
    <RadialLayoutContext.Provider value={{ angles }}>
      {children}
    </RadialLayoutContext.Provider>
  );
}
