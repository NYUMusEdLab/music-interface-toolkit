import React, { useState, useEffect } from 'react';

import WebMidi from 'webmidi';

export const MidiInput = ({ children }) => {
  // TODO: The vast majority of this code could be condensed into a useMidiInput() hook
  let [inputs, setInputs] = useState(null);

  useEffect(
    () =>
      WebMidi.enable(err => {
        if (!err) {
          setInputs({});

          // Listen for future connections or disconnections
          function onConnect({ port }) {
            if (port.type === 'input') {
              setInputs(inputs => ({ [port.id]: true, ...inputs }));
            }
          }

          function onDisconnect({ port }) {
            console.log(evt);
            console.log(a, b, c);
          }

          WebMidi.addListener('connected', onConnect);
          WebMidi.addListener('disconnected', onDisconnect);

          // Clean up global event listeners
          return () => {
            WebMidi.removeListener('connected', onConnect);
            WebMidi.removeListener('disconnected', onDisconnect);
          };
        }
      }),
    [setInputs]
  );

  let [activeNotes, setActiveNotes] = useState([]);

  useEffect(
    () => {
      function onNoteOn({ note: { number } }) {
        setActiveNotes(notes =>
          notes.includes(number) ? notes : [number, ...notes]
        );
      }

      function onNoteOff({ note: { number } }) {
        setActiveNotes(notes => {
          return notes.includes(number)
            ? [
                ...notes.slice(0, notes.indexOf(number)),
                ...notes.slice(notes.indexOf(number) + 1)
              ]
            : notes;
        });
      }

      for (let id in inputs) {
        if (inputs[id]) {
          WebMidi.getInputById(id).addListener('noteon', 'all', onNoteOn);
          WebMidi.getInputById(id).addListener('noteoff', 'all', onNoteOff);
        }
      }

      return () => {
        for (let id in inputs) {
          if (inputs[id]) {
            WebMidi.getInputById(id).removeListener('noteon', 'all', onNoteOn);
            WebMidi.getInputById(id).removeListener(
              'noteoff',
              'all',
              onNoteOff
            );
          }
        }
      };
    },
    [inputs, setActiveNotes]
  );

  return children(activeNotes);
};
