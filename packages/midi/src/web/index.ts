export * from '../../third_party/webmidi';

export function receiveMidiInputs(fn: (inputs: MIDIInput[]) => any) {
  let cancelled = false;
  let dispose = () => {
    cancelled = true;
  };

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(access => {
      // Check if the user has already cancelled the callback
      if (cancelled) {
        return;
      }

      function handleStateChange({ port }: MIDIConnectionEvent) {
        if (port.type === 'input') {
          fn([...access.inputs.values()]);
        }
      }

      access.addEventListener('statechange', handleStateChange);

      dispose = () => {
        access.removeEventListener('statechange', handleStateChange);
      };

      fn([...access.inputs.values()]);
    });
  }

  // Return function for removing event listeners
  return () => {
    dispose();
  };
}

export function receiveMidiOutputs(fn: (inputs: MIDIOutput[]) => any) {
  let cancelled = false;
  let dispose = () => {
    cancelled = true;
  };

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(access => {
      // Check if the user has already cancelled the callback
      if (cancelled) {
        return;
      }

      function handleStateChange({ port }: MIDIConnectionEvent) {
        if (port.type === 'output') {
          fn([...access.outputs.values()]);
        }
      }

      access.addEventListener('statechange', handleStateChange);

      dispose = () => {
        access.removeEventListener('statechange', handleStateChange);
      };

      fn([...access.outputs.values()]);
    });
  }

  // Return function for removing event listeners
  return () => {
    dispose();
  };
}

export function sendMIDI(
  message: MIDI.TimedMessage | MIDI.TimedMessage[],
  outputId?: string
) {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(access => {
      let messages: MIDI.TimedMessage[] = Array.isArray(message)
        ? message
        : [message];

      for (let output of access.outputs.values()) {
        if (outputId === undefined || output.id === outputId) {
          for (let { data, time } of messages) {
            output.send(data, time);
          }
        }
      }
    });
  }
}

function isInput(port: MIDIPort): port is MIDIInput {
  return port.type === 'input';
}

export function receiveMIDI(
  fn: (message: MIDI.TimedMessage) => any,
  inputId?: string
) {
  let cancelled = false;
  let dispose = () => {
    cancelled = true;
  };

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(access => {
      // Check if the user has already cancelled the callbacks
      if (cancelled) {
        return;
      }

      function dispatch({
        timeStamp: time,
        data,
        target: input
      }: MIDIMessageEvent) {
        fn({ data, time });
      }

      let inputs = new Set<MIDIInput>();

      for (let input of access.inputs.values()) {
        if (inputId === undefined || input.id === inputId) {
          input.addEventListener('midimessage', dispatch);
          inputs.add(input);
        }
      }

      function handleStateChange({ port }: MIDIConnectionEvent) {
        if (
          isInput(port) &&
          port.connection !== 'open' &&
          port.state === 'connected'
        ) {
          if (inputId === undefined || port.id === inputId) {
            port.addEventListener('midimessage', dispatch);
            inputs.add(port);
          }
        }
      }

      access.addEventListener('statechange', handleStateChange);

      dispose = () => {
        access.removeEventListener('statechange', handleStateChange);

        for (let input of inputs) {
          input.removeEventListener('midimessage', dispatch);
        }
      };
    });
  }

  // Return function for removing event listeners
  return () => {
    dispose();
  };
}
