export type MidiData = number[] | Uint8Array;

export interface MidiMessage {
  data: MidiData;
}

export interface TimedMidiMessage extends MidiMessage {
  time: number;
}

export interface LiveMidiMessage extends TimedMidiMessage {
  input: MIDIInput;
}
