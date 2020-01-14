import { MidiMessage, ChannelMessage } from '../../types';

export function onChannelMessage(
  fn: (m: ChannelMessage) => void,
  opts: { channel?: number } = {}
) {
  return (m: MidiMessage) => {
    let {
      data: [status]
    } = m;

    if (status >= 0x80 && status < 0xf0) {
      let channel = status & 0x0f;

      if (!('channel' in opts) || opts.channel === channel) {
        fn({ ...m, channel: status & 0x0f });
      }
    }
  };
}

export * from './note';
export * from './controlChange';
export * from './programChange';
export * from './pressure';
export * from './pitchBend';
