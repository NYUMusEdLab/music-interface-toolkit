export type MidiData = number[] | Uint8Array;

export interface RawMidiMessage {
  data: MidiData;
}
