import { MidiData, MidiMessage } from '../types';

const SYSTEM_EXCLUSIVE = 0xf0;
const END_OF_EXCLUSIVE = 0xf7;

export function systemExclusive(vendor: MidiData, data: MidiData) {
  return [SYSTEM_EXCLUSIVE, ...vendor, ...data, END_OF_EXCLUSIVE];
}

export function isSystemExclusive({ data: [status] }: MidiMessage) {
  return status === SYSTEM_EXCLUSIVE;
}

export function getSysExVendor(message: MidiMessage) {
  let { data } = message;
  return data.slice(1, data[1] !== 0 ? 2 : 4);
}

export function getSysExData(message: MidiMessage) {
  let { data } = message;
  return data.slice(data[1] !== 0 ? 2 : 4, data.indexOf(END_OF_EXCLUSIVE));
}

const MIDI_TIMECODE = 0xf1;

export function isTimecode({ data: [status] }: MidiMessage) {
  return status === MIDI_TIMECODE;
}

const SONG_POSITION = 0xf2;

export function isSongPosition({ data: [status] }: MidiMessage) {
  return status === SONG_POSITION;
}

const SONG_SELECT = 0xf3;

export function isSongSelect({ data: [status] }: MidiMessage) {
  return status === SONG_SELECT;
}

const TUNE_REQUEST = 0xf6;

export function isTuneRequest({ data: [status] }: MidiMessage) {
  return status === TUNE_REQUEST;
}

const CLOCK = 0xf8;

export function clock() {
  return [CLOCK];
}

export function isClock({ data: [status] }: MidiMessage) {
  return status === CLOCK;
}

const START_CLOCK = 0xfa;

export function startClock() {
  return [START_CLOCK];
}

export function isStartClock({ data: [status] }: MidiMessage) {
  return status === START_CLOCK;
}

const CONTINUE_CLOCK = 0xfb;

export function continueClock() {
  return [CONTINUE_CLOCK];
}

export function isContinueClock({ data: [status] }: MidiMessage) {
  return status === CONTINUE_CLOCK;
}

const STOP_CLOCK = 0xfc;

export function stopClock() {
  return [STOP_CLOCK];
}

export function isStopClock({ data: [status] }: MidiMessage) {
  return status === STOP_CLOCK;
}

const ACTIVE_SENSING = 0xfe;

export function activeSensing() {
  return [ACTIVE_SENSING];
}

export function isActiveSensing({ data: [status] }: MidiMessage) {
  return status === ACTIVE_SENSING;
}

const RESET = 0xff;

export function reset() {
  return [RESET];
}

export function isReset({ data: [status] }: MidiMessage) {
  return status === RESET;
}
