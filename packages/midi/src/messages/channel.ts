import { MidiMessage } from '../types';
import { toDataBytes } from '../data/index';

export function isChannelMessage(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  let [status] = message.data;

  return (
    status >= 0x80 &&
    status < 0xf0 &&
    (options.channel === undefined || options.channel === (status & 0x0f))
  );
}

export function getChannel(message: MidiMessage) {
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
function isType(message: MidiMessage, type: number) {
  return (message.data[0] & 0xf0) === type;
}

const NOTE_OFF = 0x80;
const NOTE_ON = 0x90;

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
  message: MidiMessage,
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
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  let [, , velocity] = message.data;

  return (
    (isChannelMessage(message, options) && isType(message, NOTE_OFF)) ||
    (isType(message, NOTE_ON) && velocity === 0)
  );
}

const KEY_PRESSURE = 0xa0;

export function keyPressure(channel: number, key: number, pressure: number) {
  return [status(KEY_PRESSURE, channel), key, pressure];
}

export function isKeyPressure(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  return isChannelMessage(message, options) && isType(message, KEY_PRESSURE);
}

const CONTROL_CHANGE = 0xb0;

export function controlChange(
  channel: number,
  controller: number,
  value: number
) {
  return [status(CONTROL_CHANGE, channel), controller, value];
}

export function isControlChange(
  message: MidiMessage,
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

const PROGRAM_CHANGE = 0xc0;

export function programChange(channel: number, program: number) {
  return [status(PROGRAM_CHANGE, channel), program];
}

export function isProgramChange(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  return isChannelMessage(message, options) && isType(message, PROGRAM_CHANGE);
}

const CHANNEL_PRESSURE = 0xd0;

export function channelPressure(channel: number, pressure: number) {
  return [status(CHANNEL_PRESSURE, channel), pressure];
}

export function isChannelPressure(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  return (
    isChannelMessage(message, options) && isType(message, CHANNEL_PRESSURE)
  );
}

const PITCH_BEND = 0xe0;

export function pitchBend(channel: number, bend: number) {
  let [msb, lsb] = toDataBytes(bend, 2);
  return [status(PITCH_BEND, channel), lsb, msb];
}

export function isPitchBend(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  return isChannelMessage(message, options) && isType(message, PITCH_BEND);
}
