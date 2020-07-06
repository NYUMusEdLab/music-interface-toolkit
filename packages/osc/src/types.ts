export interface OSCBundle {
  time: Number;
  packets: (OSCBundle | OSCMessage)[];
}

export interface OSCMessage {
  address: string;
  args: OSCArgument[];
  // TODO: Arg Types
}

export const OSCTypeAnnotations = [
  'i',
  'f',
  's',
  'b',
  'h',
  't',
  'd',
  'S',
  'c',
  'r',
  'm',
  'T',
  'F',
  'N',
  'I',
];

export type OSCAnnotatedArgument =
  | { i: number } // int32
  | { f: number } // float32
  | { s: string } // OSC-string
  | { b: ArrayBuffer | ArrayBufferView | number[] } // OSC-blob
  | { h: BigInt | number } // int64
  | { t: number | Date | [number, number] } // OSC-timetag
  | { d: number } // float64
  | { S: string } // Alternate OSC-string
  | { c: string } // ASCII character
  | { r: [number, number, number, number] } // RGBA color
  | { m: [number, number, number, number] } // 4-byte MIDI message
  | { T: any } // True
  | { F: any } // False
  | { N: any } // Nil/null/undefined
  | { I: any } // Impulse/infinity/bang
  | OSCAnnotatedArgument[]; // And recursive arrays

export type OSCArgument =
  | number
  | string
  | ArrayBuffer
  | ArrayBufferView
  | BigInt
  | Date
  | boolean
  | undefined
  | null
  | OSCArgument[]
  | OSCAnnotatedArgument;
