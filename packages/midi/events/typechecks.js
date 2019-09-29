export function checkChannel(channel) {
  if (
    channel !== null &&
    (typeof channel !== 'number' || channel < 0 || channel > 15)
  ) {
    throw new Error(
      'MIDI channel must be a number from 0-15 or null (for all channels)'
    );
  }
}

export function checkByte(name, value) {
  if (typeof value !== 'number' || value < 0 || value > 127) {
    throw new Error(`MIDI ${name} must be a number from 0-127`);
  }
}
