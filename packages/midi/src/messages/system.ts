import {
  SYSTEM_EXCLUSIVE,
  MIDI_TIMECODE,
  SONG_POSITION,
  SONG_SELECT,
  TUNE_REQUEST,
  END_OF_EXCLUSIVE,
  CLOCK,
  START_CLOCK,
  CONTINUE_CLOCK,
  STOP_CLOCK,
  ACTIVE_SENSING,
  RESET
} from './systemTypes';

import { MidiData, MidiMessage } from '../types';

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

export function isTimecode({ data: [status] }: MidiMessage) {
  return status === MIDI_TIMECODE;
}

export function isSongPosition({ data: [status] }: MidiMessage) {
  return status === SONG_POSITION;
}

export function isSongSelect({ data: [status] }: MidiMessage) {
  return status === SONG_SELECT;
}

export function isTuneRequest({ data: [status] }: MidiMessage) {
  return status === TUNE_REQUEST;
}

export function clock() {
  return [CLOCK];
}

export function isClock({ data: [status] }: MidiMessage) {
  return status === CLOCK;
}

export function startClock() {
  return [START_CLOCK];
}

export function isStartClock({ data: [status] }: MidiMessage) {
  return status === START_CLOCK;
}

export function continueClock() {
  return [CONTINUE_CLOCK];
}

export function isContinueClock({ data: [status] }: MidiMessage) {
  return status === CONTINUE_CLOCK;
}

export function stopClock() {
  return [STOP_CLOCK];
}

export function isStopClock({ data: [status] }: MidiMessage) {
  return status === STOP_CLOCK;
}

export function activeSensing() {
  return [ACTIVE_SENSING];
}

export function isActiveSensing({ data: [status] }: MidiMessage) {
  return status === ACTIVE_SENSING;
}

export function reset() {
  return [RESET];
}

export function isReset({ data: [status] }: MidiMessage) {
  return status === RESET;
}
