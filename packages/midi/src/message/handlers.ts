import { NoteOnMessage, NoteOffMessage, RawMidiMessage } from '../types';
import { parseMidiMessage } from './parse';
import { NOTE_ON, NOTE_OFF } from './statuses';

export function onNote(
  noteOn: (note: NoteOnMessage) => void,
  noteOff: (note: NoteOffMessage) => void
) {
  return (m: RawMidiMessage) => {
    let message = parseMidiMessage(m);

    if (message.status === NOTE_ON) {
      noteOn(message);
    } else if (message.status === NOTE_OFF) {
      noteOff(message);
    }
  };
}
