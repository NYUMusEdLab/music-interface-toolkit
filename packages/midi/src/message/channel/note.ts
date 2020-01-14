import { ChannelMessage, NoteMessage } from '../../types';
import { NOTE_OFF, NOTE_ON } from '../../data/statusBytes';
import { onChannelMessage } from './index';

/**
 * Generate raw MIDI data for a Note On message (status byte 0x90).
 *
 * @param channel The MIDI channel to send on, 0-15.
 * @param key The MIDI key to play from 0-127.
 * @param velocity The attack velocity for the note. A note on with a velocity of 0 will generally be treated as a Note Off message.
 */
export function noteOn(channel: number, key: number, velocity = 64) {
  return [NOTE_ON | (channel & 0xf), key, velocity];
}

/**
 * Create a function for handling Note On messages. The callback function will be called for all Note On messages with velocities greater than 0 (which are treated as Note Off messages).
 *
 * @param fn
 * @param opts
 */
export function onNoteOn(
  fn: (m: NoteMessage) => void,
  opts: { channel?: number } = {}
) {
  return onChannelMessage(
    (m: ChannelMessage) => {
      let {
        data: [status, key, velocity]
      } = m;

      if ((status & 0xf0) === NOTE_ON && velocity > 0) {
        fn({ ...m, key, velocity });
      }
    },
    { channel: opts.channel }
  );
}

export function noteOff(channel: number, key: number, velocity = 64) {
  return [NOTE_OFF | (channel & 0xf), key, velocity];
}

export function onNoteOff(
  fn: (m: NoteMessage) => void,
  opts: { channel?: number } = {}
) {
  return onChannelMessage(
    (m: ChannelMessage) => {
      let {
        data: [status, key, velocity]
      } = m;

      if (
        (status & 0xf0) === NOTE_OFF ||
        ((status & 0xf0) === NOTE_ON && velocity === 0)
      ) {
        fn({ ...m, key, velocity });
      }
    },
    { channel: opts.channel }
  );
}
