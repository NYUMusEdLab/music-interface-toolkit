import { MIDIData, TimedMIDIMessage } from '../types';

import {
  toBytes,
  fromBytes,
  toVarLengthBytes,
  fromVarLengthBytes
} from '../data/index';

export function encodeMidiFile(
  format: 0 | 1 | 2,
  division: number | [24 | 25 | 29 | 30, number],
  tracks: TimedMIDIMessage[][]
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

  let headerChunk = encodeChunk('MThd', [
    ...toBytes(format, 2),
    ...toBytes(tracks.length, 2),
    ...divisionBytes
  ]);

  let trackChunks: MIDIData[] = [];

  for (let track of tracks) {
    let trackData = [];
    let lastTime = 0;
    let runningStatus = null;

    for (let event of track) {
      // Encode the delta time
      trackData.push(...toVarLengthBytes(event.time - lastTime));

      let [status, ...messageData] = event.data;
      let messageDataLength: number[];

      if (status >= 0x80 && status < 0xf0) {
        // Channel Message
        if (event.data.length !== channelMessageLength(status)) {
          throw new Error('Channel message has an incorrect length');
        }

        if (status === runningStatus) {
          trackData.push(...messageData);
        } else {
          trackData.push(status, ...messageData);
          runningStatus = status;
        }
      } else if (status === 0xf0) {
        // SysEx Message
        runningStatus = null;
        messageDataLength = toVarLengthBytes(messageData.length);
        trackData.push(status, ...messageDataLength, ...messageData);
      } else if (status === 0xff) {
        // Meta Message
        runningStatus = null;
        let metaType: number;
        [metaType, ...messageData] = messageData;
        messageDataLength = toVarLengthBytes(messageData.length);
        trackData.push(status, metaType, ...messageDataLength, ...messageData);
      } else {
        // Unrecognized Message to be wrapped in an 0xf7
        runningStatus = null;
        messageDataLength = toVarLengthBytes(event.data.length);
        trackData.push(0xf7, ...messageDataLength, ...event.data);
      }
    }

    trackChunks.push(encodeChunk('MTrk', trackData));
  }

  // Create an array large enough to hold the entire file
  let dataLength =
    headerChunk.length +
    trackChunks.reduce<number>((sum, { length }) => sum + length, 0);
  let data = new Uint8Array(dataLength);

  // Copy file data into the new array
  data.set(headerChunk);
  let offset = headerChunk.length;
  for (let trackChunk of trackChunks) {
    data.set(trackChunk, offset);
    offset += trackChunks.length;
  }

  return data;
}

function encodeChunk(chunkType: string, data: MIDIData) {
  let chunkTypeBytes = new TextEncoder().encode(chunkType);

  const chunk = new Uint8Array(8 + data.length);
  chunk.set(chunkTypeBytes);
  chunk.set(toBytes(data.length, 4), 4);
  chunk.set(data, 8);

  return chunk;
}

export interface MidiFile {
  format: 0 | 1 | 2;
  frameRate?: 24 | 25 | 29 | 30;
  division: number;
  tracks: TimedMIDIMessage[][];
}

export function decodeMidiFile(data: MIDIData): MidiFile {
  // Convert to a Uint8Array, if it isn't already
  if (!(data instanceof Uint8Array)) {
    data = new Uint8Array(data);
  }

  // Check for a MIDI header first thing
  if (new TextDecoder().decode(data.subarray(0, 4)) !== 'MThd') {
    throw new Error(`File doesn't have a valid MIDI header`);
  }

  // Parse header
  let [, headData, rest] = consumeChunk(data);

  let format = fromBytes(headData.subarray(0, 2));

  if (!(format === 0 || format === 1 || format === 2)) {
    throw new Error(`MIDI file is format ${format}, which is unsupported`);
  }

  let numTracks = fromBytes(headData.subarray(2, 4));

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
    division = fromBytes(headData.subarray(4, 6));
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

function consumeChunk(data: Uint8Array): [string, Uint8Array, Uint8Array] {
  let type = new TextDecoder().decode(data.subarray(0, 4));
  let length = fromBytes(data.subarray(4, 8));

  if (data.length < 8 + length) {
    throw new Error('File is missing data');
  }

  return [type, data.subarray(8, 8 + length), data.subarray(8 + length)];
}

function decodeTrack(bytes: Uint8Array) {
  let track: TimedMIDIMessage[] = [];

  let endOfTrackEncountered = false;
  let time = 0;
  let runningStatus: number | null = null;

  while (!endOfTrackEncountered) {
    // Get event delta time
    let [delta, n] = fromVarLengthBytes(bytes);
    time += delta;

    // Drop the delta time bytes from the byte array
    bytes = bytes.subarray(n);

    // Message length
    let length: number;

    // Check the first byte of the message
    if (bytes[0] <= 0x7f) {
      // If the next byte is a MIDI Data byte

      if (runningStatus === null) {
        throw new Error(
          'Missing status byte while running status is not in effect'
        );
      }

      length = channelMessageLength(runningStatus) - 1;
      track.push({ time, data: [runningStatus, ...bytes.slice(0, length)] });
    } else if (bytes[0] >= 0x80 && bytes[0] < 0xf0) {
      // Channel mode message
      runningStatus = bytes[0];
      length = channelMessageLength(runningStatus);
      track.push({ time, data: bytes.slice(0, length) });
    } else if (bytes[0] === 0xf0) {
      // SysEx Message
      runningStatus = null;
      let [dataLength, l] = fromVarLengthBytes(bytes.subarray(1));
      let dataBegin = l + 1;
      length = dataBegin + dataLength;
      track.push({ time, data: [0xf0, ...bytes.slice(dataBegin, length)] });
    } else if (bytes[0] === 0xf7) {
      // Escaped Data
      runningStatus = null;
      let [dataLength, l] = fromVarLengthBytes(bytes.subarray(1));
      let dataBegin = l + 1;
      length = dataBegin + dataLength;
      track.push({ time, data: bytes.slice(dataBegin, length) });
    } else if (bytes[0] === 0xff) {
      // Meta Message
      runningStatus = null;
      let metaType = bytes[1];
      let [dataLength, l] = fromVarLengthBytes(bytes.subarray(2));
      let dataBegin = l + 2;
      length = dataBegin + dataLength;
      track.push({
        time,
        data: [0xff, metaType, ...bytes.slice(dataBegin, length)]
      });
      if (metaType === 0x2f) {
        endOfTrackEncountered = true;
      }
    } else {
      throw new Error(`File has unexpected event type: ${bytes[0]}`);
    }

    // Drop the message from the byte array
    bytes = bytes.subarray(length);
  }

  return track;
}

function channelMessageLength(status: number) {
  if (status >= 0x80 && status < 0xc0) {
    return 3;
  } else if (status >= 0xc0 && status < 0xe0) {
    return 2;
  } else if (status >= 0xe0 && status < 0xf0) {
    return 3;
  } else {
    throw new Error('Unexpected channel message status');
  }
}
