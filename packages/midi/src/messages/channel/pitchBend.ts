import { PITCH_BEND } from '../../data/statusBytes';
import { ChannelMessage, PitchBendMessage } from '../../types';
import { onChannelMessage } from '../channel';

export function pitchBend(channel: number, value: number) {
  return [
    PITCH_BEND | (channel & 0xf),
    value & 0b1111111,
    (value >> 7) & 0b1111111
  ];
}

export function onPitchBend(fn: (m: PitchBendMessage) => void) {
  return onChannelMessage((m: ChannelMessage) => {
    let {
      data: [status, lsb, msb]
    } = m;

    if ((status & 0xf0) === PITCH_BEND) {
      fn({ ...m, value: lsb | (msb << 7) });
    }
  });
}
