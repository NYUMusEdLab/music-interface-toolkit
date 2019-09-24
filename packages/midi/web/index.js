import { OutputEngine } from '../OutputEngine';

const requestMidi = navigator.requestMIDIAccess
  ? navigator.requestMIDIAccess()
  : null;

export class MidiEngine extends OutputEngine {
  noteOn(note) {
    if (requestMidi) {
      // [message_type, note, velocity]
      const message = [144, note, 80];

      requestMidi.then(access => {
        for (let output of access.outputs.values()) {
          output.send(message);
        }
      });
    }
  }

  noteOff(note) {
    if (requestMidi) {
      // [message_type, note, velocity]
      const message = [128, note, 80];

      requestMidi.then(access => {
        for (let output of access.outputs.values()) {
          output.send(message);
        }
      });
    }
  }
}
