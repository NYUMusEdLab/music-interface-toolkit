declare namespace MIDI {
  export type Data = number[] | Uint8Array;

  export interface Message {
    data: Data;
    time?: number;
  }

  export interface TimedMessage extends Message {
    time: number;
  }
}
