import { MidiData } from '../types';

export function toBytes(value: number, length: number) {
  let data: MidiData = [];

  for (let i = 0; i < length; ++i) {
    data[i] = (value >> (8 * (length - i - 1))) & 0xff;
  }

  return data;
}

export function toDataBytes(value: number, length: number) {
  let data: MidiData = [];

  for (let i = 0; i < length; ++i) {
    data[i] = (value >> (7 * (length - i - 1))) & 0x7f;
  }

  return data;
}

export function fromBytes(data: MidiData) {
  let length = data.length;
  let value = 0;

  for (let i = 0; i < length; ++i) {
    value |= data[i] << (8 * (length - i - 1));
  }

  return value;
}

export function fromDataBytes(data: MidiData) {
  let length = data.length;
  let value = 0;

  for (let i = 0; i < length; ++i) {
    value |= data[i] << (7 * (length - i - 1));
  }

  return value;
}
