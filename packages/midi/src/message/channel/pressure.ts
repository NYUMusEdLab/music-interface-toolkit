import {
  ChannelMessage,
  KeyPressureMessage,
  ChannelPressureMessage
} from '../../types';
import { onChannelMessage } from './index';
import { KEY_PRESSURE, CHANNEL_PRESSURE } from '../../data/statusBytes';

export function onKeyPressure(fn: (m: KeyPressureMessage) => void) {
  return onChannelMessage((m: ChannelMessage) => {
    let {
      data: [status, key, value]
    } = m;

    if ((status & 0xf0) === KEY_PRESSURE) {
      fn({ ...m, key, value });
    }
  });
}

export function onChannelPressure(fn: (m: ChannelPressureMessage) => void) {
  return onChannelMessage((m: ChannelMessage) => {
    let {
      data: [status, value]
    } = m;

    if ((status & 0xf0) === CHANNEL_PRESSURE) {
      fn({ ...m, value });
    }
  });
}
