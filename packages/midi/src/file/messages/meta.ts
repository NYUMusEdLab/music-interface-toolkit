import { MidiMessage } from '../../types';

const META_EVENT = 0xff;

export function isMetaMessage(message: MidiMessage) {
  let [status] = message.data;

  return status === META_EVENT;
}

// TODO: More Meta events:

const SEQUENCE_NUMBER = 0x00;
const TEXT_EVENT = 0x01;
const COPYRIGHT = 0x02;
const SEQUENCE_TRACK_NAME = 0x03;
const INSTRUMENT_NAME = 0x04;
const LYRIC = 0x05;
const MARKER = 0x06;
const CUE_POINT = 0x07;
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
const KEY_SIGNATURE = 0x59;
const SEQUENCER_SPECIFIC = 0x7f;
