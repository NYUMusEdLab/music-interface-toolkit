import { MidiData, LiveMidiMessage } from '../types';

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

export function sendMIDI(data: MidiData, options: { timestamp?: number } = {}) {
  let { timestamp = 0 } = options;

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(access => {
      for (let output of access.outputs.values()) {
        output.send(data, timestamp);
      }
    });
  }
}

function isInput(port: MIDIPort): port is MIDIInput {
  return port.type === 'input';
}

export function receiveMIDI(fn: (message: LiveMidiMessage) => any) {
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
        fn({ data, input, time });
      }

      let inputs = new Set<MIDIInput>();

      for (let input of access.inputs.values()) {
        input.addEventListener('midimessage', dispatch);
        inputs.add(input);
      }

      function handleStateChange({ port }: MIDIConnectionEvent) {
        if (
          isInput(port) &&
          port.connection !== 'open' &&
          port.state === 'connected'
        ) {
          port.addEventListener('midimessage', dispatch);
          inputs.add(port);
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
