import { createInterface } from 'readline';

let command = process.argv.slice(2).join(' ');

if (command) {
  try {
    runCommand(command);
  } catch (e) {
    console.log(e.message);
  }
} else {
  let io = createInterface(process.stdin);

  console.log('Welcome to the OSC terminal. type "help" for help');
  io.question('', runCommand);
}

function runCommand(command: string) {
  // Clean up command and extract first token
  let [action, args] = command.trim().split(/\s+/, 1);

  switch (action.toLowerCase()) {
    case 'help':
      break;
    case 'send':
      break;
    case 'listen':
      break;
    case 'bridge':
      break;
  }

  return true;
}
