import { MidiData, MidiMessage } from '../../types';
import { SYSTEM_EXCLUSIVE, END_OF_EXCLUSIVE } from '../../data/statusBytes';

export interface SystemExclusiveMessage extends MidiMessage {
  manufacturer: number[];
  systemExclusiveData: MidiData;
}

export function systemExclusive(manufacturer: number[], data: MidiData) {
  return [SYSTEM_EXCLUSIVE, ...manufacturer, ...data, END_OF_EXCLUSIVE];
}

export function onSystemExclusive(fn: (m: SystemExclusiveMessage) => void) {
  return (m: MidiMessage) => {
    let {
      data: [status, ...data]
    } = m;

    if (status === SYSTEM_EXCLUSIVE) {
      let manufacturer = data.slice(0, data[0] !== 0 ? 1 : 3);
      let systemExclusiveData = data.slice(
        manufacturer.length,
        data.indexOf(END_OF_EXCLUSIVE)
      );

      fn({ ...m, manufacturer, systemExclusiveData });
    }
  };
}
