import { TimedMidiMessage, MidiData } from '../types';
import { toBytes, fromBytes } from '../number/index';

function variable(n: number) {
  let bytes = [];

  // Numbers that need 4 bytes
  if (n > 0x1fffff) {
    bytes.push((n >> 21) & 0x7f);
  }

  // Numbers that need at least 3 bytes
  if (n > 0x3fff) {
    bytes.push((n >> 14) & 0x7f);
  }

  // Numbers that need at least 2 bytes
  if (n > 0x7f) {
    bytes.push((n >> 7) & 0x7f);
  }

  // All numbers need at least 1 byte
  bytes.push(n & 0x7f);

  return new Uint8Array(bytes);
}

function encodeChunk(chunkType: string, data: Uint8Array) {
  let chunkTypeBytes = new TextEncoder().encode(chunkType);

  return new Uint8Array([
    ...chunkTypeBytes,
    ...toBytes(data.length, 4),
    ...data
  ]);
}

function encodeMidiFile(
  format: 0 | 1 | 2,
  division: number | [24 | 25 | 29 | 30, number],
  tracks: TimedMidiMessage[][]
) {
  if (format === 0 && tracks.length !== 1) {
    throw new Error('Format 0 MIDI file must only have one track');
  }

  let divisionBytes;

  if (typeof division === 'number') {
    divisionBytes = toBytes(division, 2);
  } else {
    let [frameRate, frameDivision] = division;
    divisionBytes = new Uint8Array([-frameRate, frameDivision]);
  }

  let header = encodeChunk(
    'MThd',
    new Uint8Array([
      ...toBytes(format, 2),
      ...toBytes(tracks.length, 2),
      ...divisionBytes
    ])
  );

  for (let track of tracks) {
    let trackData = [];
    let lastTime = 0;
    let runningStatus = null;

    for (let event of track) {
      // Encode the delta time
      variable(event.time - lastTime);
    }
  }
}

export interface MidiFile {
  format: 0 | 1 | 2;
  frameRate?: 24 | 25 | 29 | 30;
  division: number;
  tracks: TimedMidiMessage[][];
}

export function decodeMidiFile(data: MidiData): MidiFile {
  // Parse header
  console.log('parse header');
  let [headType, headData, rest] = consumeChunk(data);

  console.log('correctly consumed');
  console.log(data);
  console.log(headData);

  if (headType !== 'MThd') {
    throw new Error(`File doesn't have a valid MIDI header`);
  }

  let format = fromBytes(headData.slice(0, 2));

  if (!(format === 0 || format === 1 || format === 2)) {
    throw new Error(`MIDI file is format ${format}, which is unsupported`);
  }

  let numTracks = fromBytes(headData.slice(2, 4));

  if (format === 0 && numTracks !== 1) {
    throw new Error(
      `Format 0 MIDI files must have 1 track. This file has ${numTracks}`
    );
  }

  let frameRate, division;

  if (Math.sign(headData[4]) === -1) {
    frameRate = -headData[4];
    division = headData[5];

    if (
      !(
        frameRate === 24 ||
        frameRate === 25 ||
        frameRate === 29 ||
        frameRate === 30
      )
    ) {
      throw new Error(
        `MIDI file has a non-standard frame rate of ${frameRate} fps`
      );
    }
  } else {
    division = fromBytes(headData.slice(4, 6));
  }

  let tracks = [[]];

  let tempTracks = [];

  while (tempTracks.length < numTracks) {
    let chunkType, trackData;
    [chunkType, trackData, rest] = consumeChunk(rest);

    if (chunkType === 'MTrk') {
      // decodeTrack(trackData);
      tempTracks.push([]);
    }
  }

  if (frameRate !== undefined) {
    return { format, frameRate, division, tracks };
  } else {
    return { format, division, tracks };
  }
}

function consumeChunk(data: MidiData): [string, MidiData, MidiData] {
  let type = new TextDecoder().decode(new Uint8Array(data.slice(0, 4)));
  let length = fromBytes(data.slice(4, 8));

  console.log(`Test: ${fromBytes([0, 0, 0, 6])}`);

  console.log(`Length: ${length}`);

  if (data.length < 8 + length) {
    throw new Error('File is missing data');
  }

  return [type, data.slice(8, 8 + length), data.slice(8 + length)];
}

function decodeTrack(data: MidiData) {}
