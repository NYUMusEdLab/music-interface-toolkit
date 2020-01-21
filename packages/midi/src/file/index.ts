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
  // Check for a MIDI header first thing
  if (new TextDecoder().decode(new Uint8Array(data.slice(0, 4))) !== 'MThd') {
    throw new Error(`File doesn't have a valid MIDI header`);
  }

  // Parse header
  let [, headData, rest] = consumeChunk(data);

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

  let tracks = [];

  while (tracks.length < numTracks) {
    let chunkType, trackData;
    [chunkType, trackData, rest] = consumeChunk(rest);

    if (chunkType === 'MTrk') {
      tracks.push(decodeTrack(trackData));
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

  if (data.length < 8 + length) {
    throw new Error('File is missing data');
  }

  return [type, data.slice(8, 8 + length), data.slice(8 + length)];
}

function decodeTrack(bytes: MidiData) {
  let track: TimedMidiMessage[] = [];

  let endOfTrackEncountered = false;
  let time = 0;
  let runningStatus: number | null = null;

  let i = 0;

  while (!endOfTrackEncountered) {
    // Get event delta time
    let delta: number;
    [delta, i] = readVarLengthValue(bytes, i);
    time += delta;

    // Pointer to the byte after the message
    let j: number;

    // Length of variable-length messages (SysEx and Meta)
    let length: number;

    if (bytes[i] <= 0x7f && runningStatus !== null) {
      // If the next byte is a MIDI Data byte
      j = channelMessageLength(runningStatus) + i - 1;
      track.push({ time, data: [runningStatus, ...bytes.slice(i, j)] });
    } else if (bytes[i] >= 0x80 && bytes[i] < 0xf0) {
      // Channel mode message
      runningStatus = bytes[i];
      j = channelMessageLength(runningStatus) + i;
      track.push({ time, data: bytes.slice(i, j) });
    } else if (bytes[i] === 0xf0) {
      // SysEx Message
      runningStatus = null;
      [length, i] = readVarLengthValue(bytes, i + 1);
      j = i + length;
      track.push({ time, data: [0xf0, ...bytes.slice(i, j)] });
    } else if (bytes[i] === 0xf7) {
      // Escaped Data
      runningStatus = null;
      [length, i] = readVarLengthValue(bytes, i + 1);
      j = i + length;
      track.push({ time, data: bytes.slice(i, j) });
    } else if (bytes[i] === 0xff) {
      // Meta Message
      runningStatus = null;
      let metaType = bytes[i + 1];
      [length, j] = readVarLengthValue(bytes, i + 2);
      j += length;
      track.push({ time, data: bytes.slice(i, j) });
      if (metaType === 0x2f) {
        endOfTrackEncountered = true;
      }
    } else {
      throw new Error(`File has unexpected event type: ${bytes[i]}`);
    }

    i = j;
  }

  return track;
}

function readVarLengthValue(data: MidiData, i: number) {
  let value = 0;
  while (data[i] > 0x7f) {
    value = (value << 7) | (data[i] & 0x7f);
    i++;
  }
  value = (value << 7) | data[i];
  i++;

  return [value, i];
}

function channelMessageLength(status: number) {
  if (status >= 0x80 && status < 0xc0) {
    return 3;
  } else if (status >= 0xc0 && status < 0xe0) {
    return 2;
  } else if (status >= 0xe0 && status < 0xf0) {
    return 3;
  } else {
    throw new Error();
  }
}
