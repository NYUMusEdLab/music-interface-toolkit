import { checkChannel, checkByte } from './typechecks.js';

// Channel voice messages
const messageMask = 0b11110000;
const channelMask = 0b00001111;

export function noteOff(...args) {
  const noteOffMessage = 0b10000000;
  if (typeof args[0] === 'function') {
    const [callback, channel = null] = args;

    if (process.env.NODE_ENV === 'development') {
      checkChannel(channel);
    }

    return ({ data: [status, note, velocity], ...metadata }) => {
      if (
        (status & messageMask) === noteOffMessage &&
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
    const [channel, note, velocity = 0] = args;

    if (process.env.NODE_ENV === 'development') {
      checkChannel(channel);
      checkByte('note', note);
      checkByte('velocity', velocity);
    }

    return [noteOffMessage | channel, note, velocity];
  }
}

export function noteOn(...args) {
  const noteOnMessage = 0b10010000;
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

    return [noteOnMessage | channel, pitch, velocity];
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
