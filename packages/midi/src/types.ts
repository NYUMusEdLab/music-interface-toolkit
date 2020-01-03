import * as Status from './message/statuses';

export type MidiData = number[] | Uint8Array;

export interface RawMidiMessage {
  data: MidiData;
}

export interface MidiMessage {
  status: number;
}

export interface ChannelMessage extends MidiMessage {
  channel: number;
}

export interface NoteMessage extends ChannelMessage {
  key: number;
  velocity: number;
}

export interface NoteOffMessage extends NoteMessage {
  status: typeof Status.NOTE_OFF;
}

export interface NoteOnMessage extends NoteMessage {
  status: typeof Status.NOTE_ON;
}

export interface KeyPressureMessage extends ChannelMessage {
  status: typeof Status.KEY_PRESSURE;
  key: number;
  value: number;
}

export interface ControlChangeMessage extends ChannelMessage {
  status: typeof Status.CONTROL_CHANGE;
  controller: number;
  value: number;
}

export type LiveMidiMessage =
  | NoteOffMessage
  | NoteOnMessage
  | KeyPressureMessage
  | ControlChangeMessage;
