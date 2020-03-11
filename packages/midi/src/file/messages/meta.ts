import { META } from './types';

import { fromBytes } from '../../data/index';

export function isMetaMessage(
  message: MIDI.Message,
  options: { type?: number } = {}
) {
  let [status, metaType] = message.data;
  let { type } = options;

  return status === META && (type === undefined || type === metaType);
}

// Get text from a text event, copyright event, track name event,
// instrument name event, lyric event, marker event, or cue point event
export function getText(message: MIDI.Message) {
  return String.fromCharCode(...message.data.slice(2));
}

export function getTempo(message: MIDI.Message) {
  let microsecondsPerQuarter = fromBytes(message.data.slice(2, 5));

  // (beats/microsecond) * (60,000,000 microseconds/minute)
  return (1 / microsecondsPerQuarter) * 60000000;
}

export function getSMPTEOffset(message: MIDI.Message) {}

export function getTimeSignature(message: MIDI.Message) {
  let [
    ,
    ,
    beatsPerMeasure,
    beatSubdivision,
    clocksPerQuarter,
    thirtySecondsPerQuarter
  ] = message.data;
}

export function getKeySignature(message: MIDI.Message) {
  let [, , sharpsOrFlats, quality] = message.data;

  // TODO: Get Root from sharps/flats

  if (quality !== 0 && quality !== 1) throw new Error();
  let qualityName = quality === 0 ? 'major' : 'minor';
}
