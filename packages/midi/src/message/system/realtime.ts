import {
  CLOCK,
  START,
  CONTINUE,
  STOP,
  ACTIVE_SENSING,
  RESET
} from '../../data/statusBytes';
import { MidiMessage } from '../../types';

export function timingClock() {
  return [CLOCK];
}

export function onTimingClock(fn: (m: MidiMessage) => void) {
  return (m: MidiMessage) => {
    if (m.data[0] === CLOCK) {
      fn(m);
    }
  };
}

export function timingStart() {
  return [START];
}

export function onTimingStart(fn: (m: MidiMessage) => void) {
  return (m: MidiMessage) => {
    if (m.data[0] === START) {
      fn(m);
    }
  };
}

export function timingContinue() {
  return [CONTINUE];
}

export function onTimingContinue(fn: (m: MidiMessage) => void) {
  return (m: MidiMessage) => {
    if (m.data[0] === CONTINUE) {
      fn(m);
    }
  };
}

export function timingStop() {
  return [STOP];
}

export function onTimingStop(fn: (m: MidiMessage) => void) {
  return (m: MidiMessage) => {
    if (m.data[0] === STOP) {
      fn(m);
    }
  };
}

export function activeSensing() {
  return [ACTIVE_SENSING];
}

export function onActiveSensing(fn: (m: MidiMessage) => void) {
  return (m: MidiMessage) => {
    if (m.data[0] === ACTIVE_SENSING) {
      fn(m);
    }
  };
}

export function reset() {
  return [RESET];
}

export function onReset(fn: (m: MidiMessage) => void) {
  return (m: MidiMessage) => {
    if (m.data[0] === RESET) {
      fn(m);
    }
  };
}
