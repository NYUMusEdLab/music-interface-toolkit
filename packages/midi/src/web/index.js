function requestMIDI() {
  if ('requestMIDIAccess' in navigator) {
    return navigator.requestMIDIAccess({ sysex: true });
  } else {
    return () => new Promise();
  }
}

export function sendMIDI(data, options = {}) {
  let { timestamp = 0 } = options;

  requestMIDI().then(access => {
    for (let output of access.outputs.values()) {
      output.send(data, timestamp);
    }
  });
}

export function receiveMIDI(callback) {
  let callbackList = Array.isArray(callback) ? [...callback] : [callback];

  function dispatch({ timeStamp: time, data }) {
    let rawMidiMessage = { time, data };

    for (let callback of callbackList) {
      callback(rawMidiMessage);
    }
  }

  let dispose;

  requestMIDI().then(access => {
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
  return dispose;
}
