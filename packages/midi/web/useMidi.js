import { useEffect, useMemo } from 'react';

const listeners = new Set();

navigator.requestMIDIAccess().then(access => {
  for (let [id, input] of access.inputs) {
    input.addEventListener('midimessage', handleMidiEvent);
  }

  access.addEventListener('statechange', ({ port }) => {
    if (
      port.type === 'input' &&
      port.state === 'connected' &&
      port.connection !== 'open'
    ) {
      port.addEventListener('midimessage', handleMidiEvent);
    }
  });
});

function handleMidiEvent(event) {
  let action = midiEventToAction(event);

  if (action) {
    for (let listener of listeners) {
      listener(action);
    }
  }
}

import { NOTE_ON, NOTE_OFF } from '../actions';

function midiEventToAction({ target: { id }, timeStamp, data }) {
  let action = { port: id, timeStamp };

  if (data[0] < 0b11110000) {
    action.channel = data[0] & 0b00001111;

    switch (data[0] >> 4) {
      case 0b1000: // Note Off
      case 0b1001: // Note On
        action.note = data[1];
        action.velocity = data[2];

        action.type =
          data[0] >> 4 === 0b1001 && action.velocity > 0 ? NOTE_ON : NOTE_OFF;
        return action;
      // TODO: Other event types
    }
  } else {
    // TODO: System messages
  }

  return null;
}

export function useMidi(dispatch) {
  useEffect(() => {
    listeners.add(dispatch);

    return () => {
      listeners.remove(dispatch);
    };
  }, [dispatch]);
}
