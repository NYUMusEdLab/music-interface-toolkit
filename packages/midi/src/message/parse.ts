import { RawMidiMessage, LiveMidiMessage } from '../types';
import * as Status from './statuses';

const STATUS_MASK = 0b11110000;
const CHANNEL_MASK = 0b00001111;

export function parseMidiMessage(message: RawMidiMessage): LiveMidiMessage {
  let {
    data: [status, ...data],
    ...metadata
  } = message;

  let channel;

  if (status < Status.SYSTEM_EXCLUSIVE) {
    status = status & STATUS_MASK;
    channel = status & CHANNEL_MASK;

    let key, velocity, controller, value;

    switch (status) {
      case Status.NOTE_ON:
      case Status.NOTE_OFF:
        [key, velocity] = data;
        return { ...metadata, status, channel, key, velocity };
      case Status.KEY_PRESSURE:
        [key, value] = data;
        return { ...metadata, status, channel, key, value };
      case Status.CONTROL_CHANGE:
        [controller, value] = data;
        return { ...metadata, status, channel, controller, value };
      // case Status.PROGRAM_CHANGE:
      // case Status.CHANNEL_PRESSURE:
      //   [value] = data;
      //   return { ...metadata, status, channel, value };
      // case Status.PITCH_BEND:
      //   value = ((data[0] | (data[1] << 7)) - 0x2000) / 0b1111111;
      //   return { ...metadata, status, channel, value };
    }
  }

  throw new Error('Unexpected MIDI message type');
}
