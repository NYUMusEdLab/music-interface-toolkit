declare type MidiData = number[] | Uint8Array;
interface RawMidiMessage {
    data: MidiData;
}
interface MidiMessage {
    status: number;
    channel?: number;
    data?: number[];
}
declare function sendMIDI(data: MidiData, options?: {}): void;
declare function receiveMIDI(callback: any, options?: {}): undefined;
export { RawMidiMessage, MidiMessage, sendMIDI, receiveMIDI };
