import { MIDIMessage } from '../types';
import {
  NOTE_OFF,
  NOTE_ON,
  KEY_PRESSURE,
  CONTROL_CHANGE,
  PROGRAM_CHANGE,
  CHANNEL_PRESSURE,
  PITCH_BEND
} from './channelTypes';

import { toDataBytes } from '../data/index';

export function isChannelMessage(
  message: MIDIMessage,
  options: { type?: number; channel?: number } = {}
) {
  let [status] = message.data;

  return (
    status >= 0x80 &&
    status < 0xf0 &&
    (options.type === undefined || (options.type & 0xf0) === (status & 0x0f)) &&
    (options.channel === undefined || options.channel === (status & 0x0f))
  );
}

export function getChannel(message: MIDIMessage) {
  let [status] = message.data;

  return status & 0xf;
}

/**
 * Generate a status byte, where the first four bits represent the type of
 * message and the last four bits represent the channel.
 *
 * @param type Message type
 * @param channel Message channel
 */
function status(type: number, channel: number) {
  return (type & 0xf0) | (channel & 0x0f);
}

/**
 * Check if a channel message is of a specific type
 *
 * @param message The message to check
 * @param type The type of message to check against
 */
function isType(message: MIDIMessage, type: number) {
  return (message.data[0] & 0xf0) === type;
}

/**
 * Generate raw MIDI data for a Note On message (status byte 0x90).
 *
 * @param channel The MIDI channel to send on, 0-15.
 * @param key The MIDI key to play from 0-127.
 * @param velocity The attack velocity for the note. A note on with a velocity of 0 will generally be treated as a Note Off message.
 */
export function noteOn(channel: number, key: number, velocity = 64) {
  return [status(NOTE_ON, channel), key, velocity];
}

export function isNoteOn(
  message: MIDIMessage,
  options: { channel?: number } = {}
) {
  let [, , velocity] = message.data;

  return (
    isChannelMessage(message, options) &&
    isType(message, NOTE_ON) &&
    velocity > 0
  );
}

/**
 *
 * @param channel
 * @param key
 * @param velocity
 */
export function noteOff(channel: number, key: number, velocity = 64) {
  return [status(NOTE_OFF, channel), key, velocity];
}

export function isNoteOff(
  message: MIDIMessage,
  options: { channel?: number } = {}
) {
  let [, , velocity] = message.data;

  return (
    (isChannelMessage(message, options) && isType(message, NOTE_OFF)) ||
    (isType(message, NOTE_ON) && velocity === 0)
  );
}

export function keyPressure(channel: number, key: number, pressure: number) {
  return [status(KEY_PRESSURE, channel), key, pressure];
}

export function isKeyPressure(
  message: MIDIMessage,
  options: { channel?: number } = {}
) {
  return isChannelMessage(message, options) && isType(message, KEY_PRESSURE);
}

export function controlChange(
  channel: number,
  controller: number,
  value: number
) {
  return [status(CONTROL_CHANGE, channel), controller, value];
}

export function isControlChange(
  message: MIDIMessage,
  options: { channel?: number; controller?: number } = {}
) {
  let [, controller] = message.data;

  return (
    isChannelMessage(message, options) &&
    isType(message, CONTROL_CHANGE) &&
    controller < 120 &&
    (options.controller === undefined || options.controller === controller)
  );
}

export function programChange(channel: number, program: number) {
  return [status(PROGRAM_CHANGE, channel), program];
}

export function isProgramChange(
  message: MIDIMessage,
  options: { channel?: number } = {}
) {
  return isChannelMessage(message, options) && isType(message, PROGRAM_CHANGE);
}

export function channelPressure(channel: number, pressure: number) {
  return [status(CHANNEL_PRESSURE, channel), pressure];
}

export function isChannelPressure(
  message: MIDIMessage,
  options: { channel?: number } = {}
) {
  return (
    isChannelMessage(message, options) && isType(message, CHANNEL_PRESSURE)
  );
}

export function pitchBend(channel: number, bend: number) {
  let [msb, lsb] = toDataBytes(bend, 2);
  return [status(PITCH_BEND, channel), lsb, msb];
}

export function isPitchBend(
  message: MIDIMessage,
  options: { channel?: number } = {}
) {
  return isChannelMessage(message, options) && isType(message, PITCH_BEND);
}
