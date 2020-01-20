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

      if (opts.channel === undefined || opts.channel === channel) {
        fn({ ...m, channel: status & 0x0f });
      }
    }
  };
}