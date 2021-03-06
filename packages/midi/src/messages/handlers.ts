import { MIDIMessage } from '../types';
import { isNoteOn, isNoteOff, isControlChange, getChannel } from './channel';

export interface NoteMessage extends MIDIMessage {
  channel: number;
  key: number;
  velocity: number;
}

export function onNote(
  noteOn: (m: NoteMessage) => void,
  noteOff: (m: NoteMessage) => void,
  options: { channel?: number } = {}
) {
  let { channel } = options;

  return (m: MIDIMessage) => {
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
        noteOff(message);
      }
    }
  };
}

export function onHeldNotes(
  callback: (n: NoteMessage[]) => void,
  options: { channel?: number; sustain?: boolean } = {}
) {
  let { channel, sustain } = options;

  let heldNotes: NoteMessage[] = [];

  let isSustaining = false;

  return (m: MIDIMessage) => {
    // Handle note events
    if (isNoteOn(m, { channel }) || isNoteOff(m, { channel })) {
      let message = {
        ...m,
        channel: getChannel(m),
        key: m.data[1],
        velocity: m.data[2]
      };

      if (isNoteOn(m, { channel })) {
        heldNotes = [message, ...heldNotes];
        callback(heldNotes);
      } else {
        let index = heldNotes.findIndex(
          n => n.key === message.key && n.channel === message.channel
        );

        if (index >= 0) {
          heldNotes = [
            ...heldNotes.slice(0, index),
            ...heldNotes.slice(index + 1)
          ];
          callback(heldNotes);
        }
      }
    } else if (sustain && isControlChange(m, { channel, controller: 66 })) {
      let [, , value] = m.data;

      isSustaining = value > 80;
    }
  };
}
