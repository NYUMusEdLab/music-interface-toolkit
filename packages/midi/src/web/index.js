function requestMIDI() {
  if ('requestMIDIAccess' in navigator) {
    return navigator.requestMIDIAccess();
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

export function receiveMIDI(callback, options = {}) {
  let callbackList = Array.isArray(callback) ? [...callback] : [callback];

  console.log('receive...');

  let dispose;

  requestMIDI().then(access => {
    console.log('midi access granted...');
    let inputs = new Set();

    for (let input of access.inputs.values()) {
      for (let callback of callbackList) {
        input.addEventListener('midimessage', callback);
      }
      inputs.add(input);
    }

    function handleStateChange({ port }) {
      if (port.type === 'input' && port.connection !== 'open') {
        if (port.state === 'connected') {
          for (let callback of callbackList) {
            port.addEventListener('midimessage', callback);
          }
          inputs.add(port);
        }
      }
    }

    access.addEventListener('statechange', handleStateChange);

    dispose = () => {
      access.removeEventListener('statechange', handleStateChange);

      for (let input of inputs) {
        for (let callback of callbackList) {
          input.removeEventListener('midimessage', callback);
        }
      }
    };
  });

  // Return function for removing event listeners
  return dispose;
}
