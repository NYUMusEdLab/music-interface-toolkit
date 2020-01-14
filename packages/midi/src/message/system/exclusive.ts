import { MidiData } from '../../types';
import { SYSTEM_EXCLUSIVE, END_OF_EXCLUSIVE } from '../../data/statusBytes';

function systemExclusive(manufacturer: number[], data: MidiData) {
  return [SYSTEM_EXCLUSIVE, ...manufacturer, ...data, END_OF_EXCLUSIVE];
}

//function onSystemExclusive(fn: ())
