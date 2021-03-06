/**
 * @module <data> Contains functions for dealing with various ways that MIDI
 * represents numeric data as bytes.
 */

import { MIDIData } from '../types';

/**
 * Encode a numeric value as a specified number of unsigned bytes. The value is
 * assumed to be a non-negative integer small enough to be properly represented
 * by the number of bytes specified.
 *
 * @param value The value to encode
 * @param length The number of bytes to encode it in
 * @returns An array of bytes, starting with the most significant byte
 */
export function toBytes(value: number, length: number) {
  let data: MIDIData = [];

  for (let i = 0; i < length; ++i) {
    data[i] = (value >> (8 * (length - i - 1))) & 0xff;
  }

  return data;
}

/**
 * Encode a numeric value as a specified number of MIDI data bytes (which
 * encode 7 bits of data and have the most significant bit set to 0). The value
 * is assumed to be a non-negative integer small enough to be properly
 * represented by the number of MIDI data bytes specified.
 *
 * @param value The value to encode
 * @param length The number of bytes to encode it in
 * @returns An array of bytes, starting with the most significant byte
 */
export function toDataBytes(value: number, length: number) {
  let data: MIDIData = [];

  for (let i = 0; i < length; ++i) {
    data[i] = (value >> (7 * (length - i - 1))) & 0x7f;
  }

  return data;
}

export function toVarLengthBytes(value: number) {
  let data: MIDIData = [];

  let i = 0;

  while (value > 0) {
    let byte = value & 0x7f;

    // All bytes except the least significant have bit 7
    if (i > 0) {
      byte |= 0x80;
    }

    data.push(byte);
    value = value >> (i * 7);
  }

  // Reverse the array to get most significant byte first
  return data.reverse();
}

/**
 * Convert an array of unsigned bytes to a number by concatenating the binary
 * data of all the bytes.
 *
 * @param data An array of bytes, starting with the most significant byte
 * @returns The non-negative integer represented by those bytes
 */
export function fromBytes(data: MIDIData) {
  let length = data.length;
  let value = 0;

  for (let i = 0; i < length; ++i) {
    value |= data[i] << (8 * (length - i - 1));
  }

  return value;
}

/**
 * Convert an array of unsigned MIDI data bytes (which encode 7 bits of data
 * and have the most significant bit set to 0)to a number by concatenating the
 * binary data of all the bytes.
 *
 * @param data An array of bytes, starting with the most significant byte
 * @returns The non-negative integer represented by those bytes
 */
export function fromDataBytes(data: MIDIData) {
  let length = data.length;
  let value = 0;

  for (let i = 0; i < length; ++i) {
    value |= data[i] << (7 * (length - i - 1));
  }

  return value;
}

/**
 *
 * @param data
 */
export function fromVarLengthBytes(data: MIDIData) {
  let value = 0;
  let length = 0;

  do {
    value = (value << 7) | (data[length] & 0x7f);
    length++;
  } while (data[length - 1] > 0x7f);

  return [value, length];
}
