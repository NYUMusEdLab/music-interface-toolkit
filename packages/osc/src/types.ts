export interface OSCBundle {
  time: Number;
  packets: (OSCBundle | OSCMessage)[];
}

export interface OSCMessage {
  address: string;
  args: OSCRawArgument[];
  argTypes: OSCArgumentTagList;
}

const OSCArgumentTags = [
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
] as const;

export type OSCArgumentTag = typeof OSCArgumentTags[number];
export type OSCArgumentTagList = (OSCArgumentTag | OSCArgumentTagList)[];

export function isOSCArgumentTag(tag: string): tag is OSCArgumentTag {
  return OSCArgumentTags.includes(tag as OSCArgumentTag);
}

export type OSCRawArgument =
  | number
  | string
  | ArrayBuffer
  | ArrayBufferView
  | BigInt
  | Date
  | boolean
  | undefined
  | null;

export type OSCTaggedArgument = {
  [tag in OSCArgumentTag]?: OSCRawArgument;
};

export type OSCNormalizedArgument =
  | { i: number } // int32
  | { f: number } // float32
  | { s: string } // OSC-string
  | { b: ArrayBuffer } // OSC-blob
  | { h: BigInt } // int64
  | { t: [number, number] } // OSC-timetag
  | { d: number } // float64
  | { S: string } // Alternate OSC-string
  | { c: string } // ASCII character
  | { r: [number, number, number, number] } // RGBA color
  | { m: [number, number, number, number] } // 4-byte MIDI message
  | { T: any } // True
  | { F: any } // False
  | { N: any } // Nil/null/undefined
  | { I: any }; // Impulse/infinity/bang
