// Status Codes for Standard MIDI File messages

export * from '../../messages/channelTypes';
export { SYSTEM_EXCLUSIVE } from '../../messages/systemTypes';

export const SYSTEM_EXCLUSIVE_ESCAPE = 0xf7;
export const META = 0xff;
