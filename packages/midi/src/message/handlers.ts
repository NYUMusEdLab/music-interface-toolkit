import { MidiMessage, NoteMessage, MidiData } from '../types';
import { NOTE_ON, NOTE_OFF } from './statuses';

export function onNoteOn(fn: (m: NoteMessage) => void) {
  return (m: MidiMessage) => {
    let {
      data: [status, key, velocity]
    } = m;

    if ((status & 0xf0) === NOTE_ON && velocity > 0) {
      fn({ ...m, channel: status & 0x0f, key, velocity });
    }
  };
}

export function onNoteOff(fn: (m: NoteMessage) => void) {
  return (m: MidiMessage) => {
    let {
      data: [status, key, velocity]
    } = m;

    if (
      (status & 0xf0) === NOTE_OFF ||
      ((status & 0xf0) === NOTE_ON && velocity === 0)
    ) {
      fn({ ...m, channel: status & 0x0f, key, velocity });
    }
  };
}

// switch (status) {
//   case Status.NOTE_ON:
//   case Status.NOTE_OFF:
//     [key, velocity] = data;
//     return { ...metadata, status, channel, key, velocity };
//   case Status.KEY_PRESSURE:
//     [key, value] = data;
//     return { ...metadata, status, channel, key, value };
//   case Status.CONTROL_CHANGE:
//     [controller, value] = data;
//     return { ...metadata, status, channel, controller, value };
//   case Status.PROGRAM_CHANGE:
//   case Status.CHANNEL_PRESSURE:
//     [value] = data;
//     return { ...metadata, status, channel, value };
//   case Status.PITCH_BEND:
//     value = ((data[0] | (data[1] << 7)) - 0x2000) / 0b1111111;
//     return { ...metadata, status, channel, value };
// }

// export function onNote(
//   noteOn: (note: NoteOnMessage) => void,
//   noteOff: (note: NoteOffMessage) => void
// ) {
//   return (m: RawMidiMessage) => {
//     let message = parseMidiMessage(m);

//     if (message.status === NOTE_ON) {
//       noteOn(message);
//     } else if (message.status === NOTE_OFF) {
//       noteOff(message);
//     }
//   };
// }
