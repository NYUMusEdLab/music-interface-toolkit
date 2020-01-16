import { ChannelMessage, ProgramChangeMessage } from '../../types';
import { PROGRAM_CHANGE } from '../../data/statusBytes';
import { onChannelMessage } from './channel';

export function programChange(channel: number, program: number) {
  return [PROGRAM_CHANGE | (channel & 0xf), program];
}

export function onProgramChange(fn: (m: ProgramChangeMessage) => void) {
  return onChannelMessage((m: ChannelMessage) => {
    let {
      data: [status, value]
    } = m;

    if ((status & 0xf0) === PROGRAM_CHANGE) {
      fn({ ...m, value });
    }
  });
}
