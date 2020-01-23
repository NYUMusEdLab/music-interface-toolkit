import { MidiMessage } from '../types';

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
