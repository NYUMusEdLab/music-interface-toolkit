import { note, interval, distance } from '@tonaljs/core';

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
