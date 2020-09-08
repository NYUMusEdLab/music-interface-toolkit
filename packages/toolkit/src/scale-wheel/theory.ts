import { note, interval, distance } from '@tonaljs/core';
import { scaleNotes } from '@tonaljs/scale';

export function getChromaMap(scale: string[]) {
  return scale.reduce<{ [chroma: number]: string }>((prev, pitch) => {
    const { chroma } = note(pitch);
    if (chroma !== undefined) {
      return { ...prev, [chroma]: pitch };
    } else {
      return prev;
    }
  }, {});
}

export function getPitchInScale(chroma: number, scale: string[]) {
  let scaleChromas = scale.map((pitch) => note(pitch).chroma);

  return scaleChromas.includes(chroma)
    ? scale[scaleChromas.indexOf(chroma)]
    : null;
}

export function getIntervalQuality(root: string, scalePitch: string) {
  switch (interval(distance(root, scalePitch)).q) {
    case 'dd':
      return 'double-diminished';
    case 'd':
      return 'diminished';
    case 'm':
      return 'minor';
    case 'P':
      return 'perfect';
    case 'M':
      return 'major';
    case 'A':
      return 'augmented';
    case 'AA':
      return 'double-augmented';
  }
}
