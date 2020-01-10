function int16(n: number) {
  return new Uint8Array([n >> 8, n]);
}

function int32(n: number) {
  return new Uint8Array([...int16(n >> 16), ...int16(n)]);
}

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

  return new Uint8Array([...chunkTypeBytes, ...int32(data.length), ...data]);
}

function encodeMidiFile(
  format: 0 | 1 | 2,
  division: number | [24 | 25 | 29 | 30, number],
  tracks: (number[] | Uint8Array)[]
) {
  if (format === 0 && tracks.length !== 1) {
    throw new Error('Format 0 MIDI file must only have one track');
  }

  let divisionBytes;

  if (typeof division === 'number') {
    divisionBytes = int16(division);
  } else {
    let [frameRate, frameDivision] = division;
    divisionBytes = new Uint8Array([-frameRate, frameDivision]);
  }

  let header = encodeChunk(
    'MThd',
    new Uint8Array([
      ...int16(format),
      ...int16(tracks.length),
      ...divisionBytes
    ])
  );
}
