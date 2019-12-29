import { RawMidiMessage, MidiMessage } from "../web/index";
declare function parseMidiMessage(callback: (m: MidiMessage) => void): (m: RawMidiMessage) => void;
export { parseMidiMessage };
