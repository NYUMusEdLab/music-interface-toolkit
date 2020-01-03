function requestMIDI() {
  if ('requestMIDIAccess' in navigator) {
    return navigator.requestMIDIAccess({ sysex: true });
  } else {
    return () => new Promise();
  }
}

export function receiveMidiInputs(callback) {
  let cancelled = false;
  let dispose = () => {
    cancelled = true;
  };

  requestMIDI().then(access => {
    // Check if the user has already cancelled the callback
    if (cancelled) {
      return;
    }

    function listInputs() {
      return [...access.inputs.values()].map(input => ({
        id: input.id,
        name: input.name,
        manufacturer: input.manufacturer
      }));
    }

    function handleStateChange({ port }) {
      if (port.type === 'input') {
        callback(listInputs());
      }
    }

    access.addEventListener('statechange', handleStateChange);

    dispose = () => {
      access.removeEventListener('statechange', handleStateChange);
    };

    callback(listInputs());
  });

  // Return function for removing event listeners
  return () => {
    dispose();
  };
}

export function receiveMidiOutputs(callback) {}

export function sendMIDI(data, options = {}) {
  let { timestamp = 0 } = options;

  requestMIDI().then(access => {
    for (let output of access.outputs.values()) {
      output.send(data, timestamp);
    }
  });
}

export function receiveMIDI(callback) {
  let cancelled = false;
  let dispose = () => {
    cancelled = true;
  };

  requestMIDI().then(access => {
    // Check if the user has already cancelled the callbacks
    if (cancelled) {
      return;
    }

    let callbackList = Array.isArray(callback) ? [...callback] : [callback];

    function dispatch({
      timeStamp: time,
      data,
      target: { id, name, manufacturer }
    }) {
      let rawMidiMessage = { time, input: { id, name, manufacturer }, data };

      for (let callback of callbackList) {
        callback(rawMidiMessage);
      }
    }

    let inputs = new Set();

    for (let input of access.inputs.values()) {
      input.addEventListener('midimessage', dispatch);
      inputs.add(input);
    }

    function handleStateChange({ port }) {
      if (port.type === 'input' && port.connection !== 'open') {
        if (port.state === 'connected') {
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

  // Return function for removing event listeners
  return () => {
    dispose();
  };
}
