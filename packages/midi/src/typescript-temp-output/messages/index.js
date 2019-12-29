// Channel Messages
// System Common Messages
const SYSTEM_EXCLUSIVE = 0b11110000;

const STATUS_MASK = 0b11110000;
const CHANNEL_MASK = 0b00001111;
function parseMidiMessage(callback) {
    return ({ data: [status, ...data], ...metadata }) => {
        let parse;
        if (status < SYSTEM_EXCLUSIVE) {
            parse = {
                status: status & STATUS_MASK,
                channel: status & CHANNEL_MASK
            };
        }
        else {
            parse = { status };
        }
        if (data.length > 0) {
            parse.data = data;
        }
        callback({ ...metadata, ...parse });
    };
}
/*
import { NOTE_OFF } from './messageTypes';

export function noteOff(
  channel: number,
  key: number,
  velocity?: number
): MidiData;
export function noteOff(
  callback: (m: MidiNoteMessage) => void,
  filter?: object
): (m: RawMidiMessage) => void;
export function noteOff(
  ...args: [number, number, number?] | [(m: MidiNoteMessage) => void, object?]
): MidiData | ((m: RawMidiMessage) => void) {
  if (typeof args[0] === 'number' && typeof args[1] === 'number') {
    const [channel, note, velocity = 0] = args;

    return [NOTE_OFF | channel, note, velocity];
  } else if (typeof args[0] === 'function') {
    const [callback, filter = {}] = args;

    return parseMidiMessage(({ status, data = [], ...metadata }) => {
      if (status === NOTE_OFF) {
        let [key, velocity] = data;
        callback({ ...metadata, status, key, velocity });
      }
    });
  }

  throw new Error('Unexpected arguments for Note Off');
}

import { NOTE_ON } from './messageTypes';

export function noteOn(...args) {
  if (typeof args[0] === 'function') {
    const [callback, channel = null] = args;

    if (process.env.NODE_ENV === 'development') {
      checkChannel(channel);
    }

    return ({ data: [status, note, velocity], ...metadata }) => {
      if (
        (status & messageMask) === noteOnMessage &&
        (channel === null || channel === (status & channelMask))
      ) {
        return callback({
          channel: status & channelMask,
          note,
          velocity,
          ...metadata
        });
      }
    };
  } else {
    const [channel, pitch, velocity = 127] = args;

    if (process.env.NODE_ENV === 'development') {
      checkChannel(channel);
      checkByte('note', note);
      checkByte('velocity', velocity);
    }

    return [NOTE_ON | channel, pitch, velocity];
  }
}

export function keyPressure() {}

export function controlChange(...args) {
  const controlChangeMessage = 0b10110000;
  if (typeof args[0] === 'function') {
    const [callback, channel = null, controllerFilter = null] = args;

    if (process.env.NODE_ENV === 'development') {
      checkChannel(channel);
    }

    return ({ data: [status, controller, value], ...metadata }) => {
      if (
        (status & messageMask) === controlChangeMessage &&
        (channel === null || channel === (status & channelMask)) &&
        (controllerFilter === null || controllerFilter === controller)
      ) {
        return callback({
          channel: status & channelMask,
          controller,
          value,
          ...metadata
        });
      }
    };
  } else {
    const [channel, controller, value] = args;

    if (process.env.NODE_ENV === 'development') {
      checkChannel(channel);
      checkByte('controller number', controller);
      checkByte('controller value', value);
    }

    return [controlChangeMessage | channel, controller, value];
  }
}

export function programChange() {}

export function channelPressure() {}

export function pitchBend() {}

export function allSoundOff() {}

export function resetControllers() {}

export function localControl() {}
*/

export { parseMidiMessage };
