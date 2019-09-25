const requestMIDI = navigator.requestMIDIAccess || (() => new Promise());

export function sendMIDI(data, options = {}) {
  let { timestamp = 0 } = options;

  requestMIDI().then(access => {
    for (let output of access.outputs.values()) {
      output.send(data, timestamp);
    }
  });
}

export function receiveMIDI(callback, options = {}) {
  let dispose;

  requestMIDI().then(access => {
    let inputs = new Set();

    for (let input of access.inputs.values()) {
      input.addEventListener('midimessage', callback);
      inputs.add(input);
    }

    function handleStateChange({ port }) {
      if (port.type === 'input' && port.connection !== 'open') {
        if (port.state === 'connected') {
          port.addEventListener('midimessage', callback);
          inputs.add(port);
        }
      }
    }

    access.addEventListener('statechange', handleStateChange);

    dispose = () => {
      access.removeEventListener('statechange', handleStateChange);

      for (let input of inputs) {
        input.removeEventListener('midimessage', callback);
      }
    };
  });

  // Return function for removing event listeners
  return dispose;
}
