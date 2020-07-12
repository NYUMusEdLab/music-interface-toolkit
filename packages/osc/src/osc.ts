/*
 * Adapted from the osc.js library
 *
 * Derivative portions Copyright 2014-2016, Colin Clark
 * Licensed under the MIT and GPL 3 licenses.
 */

import {
  OSCArgumentTag,
  OSCArgumentTagList,
  OSCTaggedArgument,
  OSCArgumentInputValue,
  OSCArgumentValue,
  OSCArgumentValueList,
} from './types';

/**
 * Generate a binary OSC message with the given information
 *
 * @param address - The OSC address is used to indicate to the receiver how the
 *     message should be handled. It begins with a slash, like a URL path
 * @param args - Any number of variables to be passed as arguments to the message. These
 *     can be raw values, or objects of the form `{ [type]: [value] }`, such as `{ i: 10 }`
 *
 * @return The binary data representing this OSC message
 */
export function message(address: string, ...args: OSCArgumentInputValue[]) {
  // Basic address check
  if (!(address.indexOf('/') === 0)) {
    throw Error(
      `An OSC message must contain a valid address. Address was: ${address}`
    );
  }

  // Write arguments
  let [argTypes, argData] = writeArguments(args);

  return mergeBuffers(
    writeString(address),
    writeString(`,${argTypes}`),
    ...argData
  );
}

/**
 * Generate a binary OSC bundle. A bundle allows OSC messages to be synchronized
 * to a timestamp. A bundle can contain any number of packets, which are other OSC
 * messages or bundles. This can be achieved by nesting `bundle` and `message`
 * function, for example `bundle(1.0, message('/synth', 'sine', 440))`
 *
 * @param time - The timestamp that this bundle should be executed
 * @param packets - The binary data for the messages or bundles contained within this
 *     bundle
 *
 * @return The binary data representing this OSC bundle
 */
export function bundle(time: Date | number, ...packets: Uint8Array[]) {
  let bundleParts = [writeString('#bundle'), new Uint8Array(8)];

  // Each packet starts with its 32-bit length
  for (let packet of packets) {
    bundleParts.push(writeInt32(packet.length));
    bundleParts.push(packet);
  }

  return mergeBuffers(...bundleParts);
}

/**
 * Parse an OSC buffer
 *
 * @param rawData
 */
export function parse(data: Uint8Array) {
  let address: string;
  [address, data] = readString(data);

  let types: string;
  [types, data] = readString(data);

  if (types === '') {
    // Some implementations leave the type string off
    return { address, args: [], argTypes: [] };
  } else {
    // Slice off the leading comma
    types = types.slice(1);
    let [argTypes, args] = readArguments(types, data);
    return { address, args, argTypes };
  }
}

// Utilities
/**
 * All types in OSC are aligned to be a multiple of four bytes. This
 * convenience function takes a number and returns the next largest
 * multiple of 4.
 *
 * @param numBytes - The number of bytes
 */
function chunkSize(bytes: number) {
  return (bytes + 3) & ~0x03;
}

function mergeBuffers(...elements: Uint8Array[]) {
  let size = 0;

  // One pass to calculate the total size
  for (let element of elements) {
    size += element.byteLength;
  }

  // Check that size is a multiple of 4
  if (size % 4 !== 0) {
    throw Error(
      `An OSC message or bundle must have a size that's a multiple of 4.`
    );
  }

  let output = new Uint8Array(size);
  let offset = 0;

  // One pass to combine all of the arrays
  for (let element of elements) {
    output.set(element, offset);
    offset += element.length;
  }

  return output;
}

// ARGUMENTS
function readArguments(
  typeString: string,
  data: Uint8Array,
  nested = false
): [OSCArgumentTagList, OSCArgumentValueList, Uint8Array] {
  let argTypes: OSCArgumentTagList = [];
  let argValues: OSCArgumentValueList = [];

  for (let type of typeString) {
    let argValue: OSCArgumentValue;

    if (type === 'i') {
      argTypes.push(type);
      [argValue, data] = readInt32(data);
      argValues.push(argValue);
    } else if (type === 'f') {
      argTypes.push(type);
      [argValue, data] = readFloat32(data);
      argValues.push(argValue);
    } else if (type === 's') {
      argTypes.push(type);
      [argValue, data] = readString(data);
      argValues.push(argValue);
    } else if (type === 'b') {
      argTypes.push(type);
      [argValue, data] = readBlob(data);
      argValues.push(argValue);
    } else {
      throw Error(`Unrecognized argument type ${type}`);
    }
    // } else {
    //   // Check if the current character is the start of an array
    //   if (type === '[') {
    //     parseStack.push([]);
    //   } else if (type === ']' && parseStack.length > 1) {
    //     let array = parseStack.pop();
    //     if (array) {
    //       add(array);
    //     }
    //   } else {
    //     throw Error(`Unrecognized argument type ${type}`);
    //   }
    // }
  }

  if (nested) {
    throw Error();
  }

  return [argTypes, argValues, data];
}

function writeArguments(args: OSCArgumentInputValue[]): [string, Uint8Array[]] {
  let typeString = '';
  let argData: Uint8Array[] = [];

  for (let arg of args) {
    // Infer types for various values
    if (typeof arg === 'number') {
      arg = { f: arg };
    } else if (typeof arg === 'string') {
      arg = { s: arg };
    } else if (arg instanceof ArrayBuffer || ArrayBuffer.isView(arg)) {
      arg = { b: arg };
    } else if (typeof arg === 'boolean') {
      arg = arg ? { T: true } : { F: true };
    } else if (arg === undefined || arg === null) {
      arg = { N: true };
    }

    // Nested list of args
    if (Array.isArray(arg)) {
      let [listTypes, listArgData] = writeArguments(arg);
      typeString += `[${listTypes}]`;
      argData.push(...listArgData);
    }
    // Int 32
    else if (isTagged(arg, 'i') && typeof arg.i === 'number') {
      typeString += 'i';
      argData.push(writeInt32(arg.i));
    }
    // Float 32
    else if (isTagged(arg, 'f') && typeof arg.f === 'number') {
      typeString += 'f';
      argData.push(writeFloat32(arg.f));
    }
    // String
    else if (isTagged(arg, 's') && typeof arg.s === 'string') {
      typeString += 's';
      argData.push(writeString(arg.s));
    }
  }

  return [typeString, argData];
}

function validateArgument(arg: OSCArgumentInputValue): OSCTaggedArgument {
  // String
  if (typeof arg === 'string') {
    return { s: arg };
  } else if (typeof arg === 'bigint' || arg instanceof BigInt) {
    // Save bigints as 64-bit integers
    return { h: arg };
  } else if (arg instanceof Date) {
    return { t: arg };
  }

  return { T: null };
}

function isTagged(
  object: any,
  type: OSCArgumentTag
): object is { [k in typeof type]: any } {
  return (
    typeof object === 'object' &&
    object !== null &&
    Object.keys(object).length === 1 &&
    Object.keys(object)[0] === type
  );
}

// DATA TYPES
function writeInt32(value: number) {
  let output = new Uint8Array(4);
  new DataView(output.buffer).setInt32(0, value);
  return output;
}

function readInt32(data: Uint8Array): [number, Uint8Array] {
  let value = new DataView(data.buffer).getInt32(data.byteOffset);
  return [value, data.subarray(4)];
}

function writeFloat32(value: number) {
  let output = new Uint8Array(4);
  new DataView(output.buffer).setFloat32(0, value);
  return output;
}

function readFloat32(data: Uint8Array): [number, Uint8Array] {
  let value = new DataView(data.buffer).getFloat32(data.byteOffset);
  return [value, data.subarray(4)];
}

function writeString(str: string) {
  let unterminatedBuffer = new TextEncoder().encode(str);
  let terminatedLength = chunkSize(unterminatedBuffer.length + 1);
  let buffer = new Uint8Array(terminatedLength);
  buffer.set(unterminatedBuffer);

  return buffer;
}

function readString(data: Uint8Array): [string, Uint8Array] {
  let length = 0;

  // Look for the null terminating character
  while (length < data.length && data[length] !== 0) {
    length++;
  }

  // Decode this section of the data
  let text = new TextDecoder().decode(data.subarray(0, length));

  return [text, data.subarray(chunkSize(length))];
}

function writeBlob(blob: Uint8Array) {
  let output = new Uint8Array(chunkSize(4 + blob.length));

  // Write size followed by data
  new DataView(output.buffer).setInt32(0, blob.length);
  output.set(blob, 4);
  return output;
}

function readBlob(data: Uint8Array): [Uint8Array, Uint8Array] {
  let size = new DataView(data.buffer).getInt32(data.byteOffset);
  let blob = data.subarray(4, size + 4);
  return [blob, data.subarray(chunkSize(size + 4))];
}
