import { MidiMessage } from '../types';

export function isChannelMessage(
  { data: [status] }: MidiMessage,
  options: { channel?: number } = {}
) {
  return (
    status >= 0x80 &&
    status < 0xf0 &&
    (options.channel === undefined || options.channel === (status & 0x0f))
  );
}
