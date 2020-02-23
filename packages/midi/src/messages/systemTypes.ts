// Status codes for MIDI System Messages

// Non-Realtime
export const SYSTEM_EXCLUSIVE = 0xf0;
export const MIDI_TIMECODE = 0xf1;
export const SONG_POSITION = 0xf2;
export const SONG_SELECT = 0xf3;
// Status bytes 0xf4 and 0xf5 are undefined
export const TUNE_REQUEST = 0xf6;
export const END_OF_EXCLUSIVE = 0xf7;

// Realtime
export const CLOCK = 0xf8;
// Status byte 0xf9 is undefined
export const START_CLOCK = 0xfa;
export const CONTINUE_CLOCK = 0xfb;
export const STOP_CLOCK = 0xfc;
// Status byte 0xfd is undefined
export const ACTIVE_SENSING = 0xfe;
export const RESET = 0xff;
