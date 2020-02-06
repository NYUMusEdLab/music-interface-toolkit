import { MidiMessage } from '../../types';

const META_EVENT = 0xff;

export function isMetaMessage(message: MidiMessage) {
  let [status] = message.data;

  return status === META_EVENT;
}

// TODO: More Meta events:

const SEQUENCE_NUMBER = 0x00;

const TEXT_EVENT = 0x01;

export function isTextEvent(message: MidiMessage) {
  let [, type] = message.data;
  return isMetaMessage(message) && type === TEXT_EVENT;
}

export function getText(message: MidiMessage) {
  return String.fromCharCode(...message.data.slice(2));
}

const COPYRIGHT = 0x02;

export function isCopyright(message: MidiMessage) {
  let [, type] = message.data;
  return isMetaMessage(message) && type === COPYRIGHT;
}

const TRACK_NAME = 0x03;

export function isTrackName(message: MidiMessage) {
  let [, type] = message.data;
  return isMetaMessage(message) && type === TRACK_NAME;
}

const INSTRUMENT_NAME = 0x04;

export function isInstrumentName(message: MidiMessage) {
  let [, type] = message.data;
  return isMetaMessage(message) && type === INSTRUMENT_NAME;
}

const LYRIC = 0x05;

export function isLyric(message: MidiMessage) {
  let [, type] = message.data;
  return isMetaMessage(message) && type === LYRIC;
}

const MARKER = 0x06;

export function isMarker(message: MidiMessage) {
  let [, type] = message.data;
  return isMetaMessage(message) && type === MARKER;
}

const CUE_POINT = 0x07;

export function isCuePoint(message: MidiMessage) {
  let [, type] = message.data;
  return isMetaMessage(message) && type === CUE_POINT;
}

const CHANNEL_PREFIX = 0x20;

const END_OF_TRACK = 0x2f;

export function endOfTrack() {
  return [META_EVENT, END_OF_TRACK];
}

export function isEndOfTrack(message: MidiMessage) {
  let [, type] = message.data;

  return isMetaMessage(message) && type === END_OF_TRACK;
}

// TODO: More Meta events
const SET_TEMPO = 0x51;
const SMPTE_OFFSET = 0x54;
const TIME_SIGNATURE = 0x58;

export function isTimeSignature(message: MidiMessage) {}

export function getTimeSignature(message: MidiMessage) {}

const KEY_SIGNATURE = 0x59;

export function isKeySignature(message: MidiMessage) {}

export function getKeySignature(message: MidiMessage) {}

const SEQUENCER_SPECIFIC = 0x7f;
