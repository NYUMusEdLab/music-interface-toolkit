export type MIDIData = number[] | Uint8Array;

export interface MIDIMessage {
  data: MIDIData;
  time?: number;
  port?: number | string;
}

export interface TimedMIDIMessage extends MIDIMessage {
  time: number;
}
