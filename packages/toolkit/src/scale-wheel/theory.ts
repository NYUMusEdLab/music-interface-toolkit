import { note, interval, distance } from '@tonaljs/tonal';
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

export function getPitchInScale(chroma, scale) {
  let scaleChromas = scale.map((pitch) => note(pitch).chroma);

  return scaleChromas.includes(chroma)
    ? scale[scaleChromas.indexOf(chroma)]
    : null;
}

export function getIntervalQuality(root, scalePitch) {
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
