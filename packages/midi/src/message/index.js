export * from './parse';

export * from './channelMessages.js';
export * from './systemCommonMessages.js';
export * from './systemRealtimeMessages.js';

const STATUS_MASK = 0b11110000;
const CHANNEL_MASK = 0b00001111;

export function midiMessage(callback) {
  return ({ data: [status, ...data], ...metadata }) => {
    let parse;
    if (status < 240) {
      parse = {
        status: status & STATUS_MASK,
        channel: status & CHANNEL_MASK
      };
    } else {
      parse = { status };
    }
    if (data.length > 0) {
      parse.data = data;
    }
    callback({ ...metadata, ...parse });
  };
}
