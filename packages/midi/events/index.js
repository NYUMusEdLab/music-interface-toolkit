// Channel voice messages
const messageMask = 0b11110000;
const channelMask = 0b00001111;

const noteOffMessage = 0b10000000;
const noteOnMessage = 0b10010000;

function noteOff(...args) {
  if (typeof args[0] === 'function') {
    const [callback, channel] = args;
    return ({ data: [status, note, velocity], ...metadata }) => {
      if ((status & messageMask) === noteOffMessage) {
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
    return [noteOffMessage | channel, pitch, velocity];
  }
}

function noteOn(...args) {
  if (typeof args[0] === 'function') {
    const [callback, channel] = args;
    return ({ data: [status, note, velocity], ...metadata }) => {
      if ((status & messageMask) === noteOnMessage) {
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
    return [noteOnMessage | channel, pitch, velocity];
  }
}
