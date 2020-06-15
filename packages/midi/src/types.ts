export type MIDIData = number[] | Uint8Array;

export interface MIDIMessage {
  data: MIDIData;
  time?: number;
  input?: { id: string; name?: string; manufacturer?: string };
}

export interface TimedMIDIMessage extends MIDIMessage {
  time: number;
}
