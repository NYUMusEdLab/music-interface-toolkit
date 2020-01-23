import { toDataBytes, fromDataBytes } from '../../number/index';
import { MidiMessage } from '../../types';
import {
  MIDI_TIME_CODE,
  SONG_POSITION,
  SONG_SELECT,
  TUNE_REQUEST
} from '../../data/statusBytes';

// TODO: MIDI Time Code

export interface SongPositionMessage extends MidiMessage {
  position: number;
}

export function songPosition(position: number) {
  let [msb, lsb] = toDataBytes(position, 2);
  return [SONG_POSITION, lsb, msb];
}

export function onSongPosition(fn: (m: SongPositionMessage) => void) {
  return (m: MidiMessage) => {
    let {
      data: [status, lsb, msb]
    } = m;

    if (status === SONG_POSITION) {
      fn({ ...m, position: fromDataBytes([msb, lsb]) });
    }
  };
}
