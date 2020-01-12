import * as Status from './message/statuses';

export type MidiData = number[] | Uint8Array;

export interface MidiMessage {
  data: MidiData;
}

export interface TimedMidiMessage extends MidiMessage {
  time: number;
}

export interface ChannelMessage extends MidiMessage {
  channel: number;
}

export interface NoteMessage extends ChannelMessage {
  key: number;
  velocity: number;
}

export interface KeyPressureMessage extends ChannelMessage {
  key: number;
  value: number;
}

export interface ControlChangeMessage extends ChannelMessage {
  controller: number;
  value: number;
}

// Program change, channel pressure, and pitch bend
export interface ChannelValueMessage extends ChannelMessage {
  value: number;
}
