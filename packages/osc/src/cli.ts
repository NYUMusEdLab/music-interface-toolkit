import { createSocket } from 'dgram';

import { parse, message as oscMessage } from './osc';

let command = process.argv.slice(2).join(' ');

if (command) {
  try {
    runCommand(command);
  } catch (e) {
    console.log(e.message);
  }
}

function runCommand(command: string) {
  // Clean up command and extract first token
  let [action, args] = command.trim().split(/\s+(.*)/);

  switch (action.toLowerCase()) {
    case 'help':
      break;
    case 'send':
      send(args);
      break;
    case 'listen':
      listen(args);
      break;
    case 'talk':
      break;
    case 'bridge':
      break;
    case 'quit':
      break;
  }

  return true;
}

// Sub-programs
function help() {}

function send(args: string) {
  let { address, port, message } = extractAddress(args);

  // Parse message
  let [oscAddress, oscArgs] = message.trim().split(/\s+(.*)/);

  let oscArgValues = [];

  while (oscArgs.length > 0) {
    let arg: string;
    let match: RegExpMatchArray | null;

    console.log(oscArgs);

    if ((match = oscArgs.match(/^(\d+)(?:\s+(.*))?/))) {
      [, arg, oscArgs = ''] = match;
      oscArgValues.push({ i: parseInt(arg) });
    } else {
      throw Error(`Didn't recognize character "${oscArgs[0]}"`);
    }
  }

  let socket = createSocket('udp4');
  socket.send(oscMessage(oscAddress, ...oscArgValues), port, address, (err) => {
    socket.close();
  });
}

function listen(args: string) {
  let { address, port } = extractAddress(args);

  let socket = createSocket('udp4');

  socket.on('listening', () => {
    const info = socket.address();

    if (typeof info !== 'string') {
      console.log(`Listening for OSC on ${info.address}:${info.port}`);
    }
  });

  socket.on('message', (message, rinfo) => {
    try {
      let { address, argTypes } = parse(message);
      console.log(
        `${rinfo.address}:${rinfo.port}> ${address} ${JSON.stringify(argTypes)}`
      );
    } catch (error) {}
  });

  socket.bind(port, address);
}

function talk(args: string) {}

function bridge(args: string) {}

// Utils
function extractAddress(args: string) {
  let match = args
    .trim()
    .match(/^(?:(\d+\.\d+\.\d+\.\d+):)?(\d+)(?:([\s/].*))?$/);

  if (!match) throw Error('Please specify a port');

  console.log(`"${args}"`);

  let [, address, portString, message] = match;

  return { address, port: parseInt(portString), message };
}
