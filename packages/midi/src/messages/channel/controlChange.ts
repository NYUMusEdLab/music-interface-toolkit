import { CONTROL_CHANGE } from '../../data/statusBytes';
import { ChannelMessage, ControlChangeMessage } from '../../types';
import { onChannelMessage } from '../channel';

export function controlChange(
  channel: number,
  controller: number,
  value: number
) {
  return [CONTROL_CHANGE | (channel & 0xf), controller, value];
}

export function onControlChange(fn: (m: ControlChangeMessage) => void) {
  return onChannelMessage((m: ChannelMessage) => {
    let {
      data: [status, controller, value]
    } = m;

    if ((status & 0xf0) === CONTROL_CHANGE && controller < 120) {
      fn({ ...m, controller, value });
    }
  });
}
