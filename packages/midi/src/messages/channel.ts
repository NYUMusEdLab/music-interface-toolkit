import { MidiMessage } from '../types';

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
  return [NOTE_ON | (channel & 0xf), key, velocity];
}

export function isNoteOn(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  let [status, , velocity] = message.data;

  return (
    isChannelMessage(message, options) &&
    (status & 0xf0) === NOTE_ON &&
    velocity > 0
  );
}

export function noteOff(channel: number, key: number, velocity = 64) {
  return [NOTE_OFF | (channel & 0xf), key, velocity];
}

export function isNoteOff(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  let [status, , velocity] = message.data;

  return (
    (isChannelMessage(message, options) && (status & 0xf0) === NOTE_OFF) ||
    ((status & 0xf0) === NOTE_ON && velocity === 0)
  );
}

const KEY_PRESSURE = 0xa0;

export function isKeyPressure(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  let [status] = message.data;
  return isChannelMessage(message, options) && (status & 0xf0) === KEY_PRESSURE;
}

const CONTROL_CHANGE = 0xb0;

export function isControlChange(
  message: MidiMessage,
  options: { channel?: number; controller?: number } = {}
) {
  let [status, controller] = message.data;

  return (
    isChannelMessage(message, options) &&
    (status & 0xf0) === CONTROL_CHANGE &&
    controller < 120 &&
    (options.controller === undefined || options.controller === controller)
  );
}

const PROGRAM_CHANGE = 0xc0;

export function isProgramChange(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  let [status] = message.data;
  return (
    isChannelMessage(message, options) && (status & 0xf0) === PROGRAM_CHANGE
  );
}

const CHANNEL_PRESSURE = 0xd0;

export function isChannelPressure(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  let [status] = message.data;
  return (
    isChannelMessage(message, options) && (status & 0xf0) === CHANNEL_PRESSURE
  );
}

const PITCH_BEND = 0xe0;

export function isPitchBend(
  message: MidiMessage,
  options: { channel?: number } = {}
) {
  let [status] = message.data;
  return isChannelMessage(message, options) && (status & 0xf0) === PITCH_BEND;
}
