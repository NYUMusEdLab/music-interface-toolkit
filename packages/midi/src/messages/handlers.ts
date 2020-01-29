import { MidiMessage } from '../types';
import { isNoteOn, isNoteOff, isControlChange, getChannel } from './channel';

export interface NoteMessage extends MidiMessage {
  channel: number;
  key: number;
  velocity: number;
}

export function onNote(
  noteOn: (m: NoteMessage) => void,
  noteOff: (m: NoteMessage) => void,
  options: { channel?: number; sustain?: boolean } = {}
) {
  let { channel, sustain } = options;

  let isSustaining = false;
  let sustainedNotes = new Map<number, MidiMessage>();

  return (m: MidiMessage) => {
    // Handle note events
    if (isNoteOn(m, { channel }) || isNoteOff(m, { channel })) {
      let message = {
        ...m,
        channel: getChannel(m),
        key: m.data[1],
        velocity: m.data[2]
      };

      if (isNoteOn(m, { channel })) {
        noteOn(message);
      } else {
        if (sustain) {
        } else {
          noteOff(message);
        }
      }
    } else if (sustain && isControlChange(m, { channel, controller: 66 })) {
    }
  };
}
