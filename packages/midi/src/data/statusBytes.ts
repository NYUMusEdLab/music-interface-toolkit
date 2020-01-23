// Meaning of MIDI status bytes

// CHANNEL MESSAGES
// NOTE: These are the status bytes for each message
// on channel 0

// Channel voice messages
export const NOTE_OFF = 0b10000000;
export const NOTE_ON = 0b10010000;
export const KEY_PRESSURE = 0b10100000;
export const CONTROL_CHANGE = 0b10110000;
export const PROGRAM_CHANGE = 0b11000000;
export const CHANNEL_PRESSURE = 0b11010000;
export const PITCH_BEND = 0b11100000;

// SYSTEM MESSAGES
// System Common Messages
export const SYSTEM_EXCLUSIVE = 0b11110000;
export const MIDI_TIME_CODE = 0b11110001;
export const SONG_POSITION = 0b11110010;
export const SONG_SELECT = 0b11110011;
// 0b11110100 is Undefined (Reserved)
// 0b11110101 is Undefined (Reserved)
export const TUNE_REQUEST = 0b11110110;
export const END_OF_EXCLUSIVE = 0b11110111;

// System Real-Time
export const CLOCK = 0b11111000;
// 0b11111001 is Undefined (Reserved)
export const START = 0b11111010;
export const CONTINUE = 0b11111011;
export const STOP = 0b11111100;
// 0b11111101 is Undefined (Reserved)
export const ACTIVE_SENSING = 0b11111110;
export const RESET = 0b111111111;
