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
  io.prompt();
}

function runCommand(command: string) {
  // If command doesn't exist: throw error

  return true;
}
