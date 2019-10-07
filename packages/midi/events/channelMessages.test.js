const { noteOn, noteOff, controlChange } = require('./channelMessages.js');

describe('noteOff()', () => {
  describe('with data', () => {
    test('constructs a "note off" message', () => {
      const message = noteOff(0, 60, 0);
      expect(Array.isArray(message)).toBe(true);
      expect(message).toHaveLength(3);
      expect(message[0]).toBe(128);
    });

    test('has the correct channel', () => {
      expect(noteOff(0, 60, 127)[0]).toBe(128);
      expect(noteOff(5, 60, 127)[0]).toBe(133);
      expect(noteOff(15, 60, 127)[0]).toBe(143);
    });

    test('has the correct pitch', () => {
      expect(noteOff(0, 60, 127)[1]).toBe(60);
      expect(noteOff(0, 0, 127)[1]).toBe(0);
      expect(noteOff(0, 140, 127)[1]).toBe(140);
    });

    test('has the correct velocity (if specified)', () => {
      expect(noteOff(0, 60, 0)[2]).toBe(0);
      expect(noteOff(0, 60, 127)[2]).toBe(127);
      expect(noteOff(15, 60)[2]).toBe(0);
    });
  });
});

describe('noteOn()', () => {
  describe('with data', () => {
    test('constructs a "note on" message', () => {
      const message = noteOn(0, 60, 127);
      expect(Array.isArray(message)).toBe(true);
      expect(message).toHaveLength(3);
      expect(message[0]).toBe(144);
    });

    test('has the correct channel', () => {
      expect(noteOn(0, 60, 127)[0]).toBe(144);
      expect(noteOn(5, 60, 127)[0]).toBe(149);
      expect(noteOn(15, 60, 127)[0]).toBe(159);
    });

    test('has the correct pitch', () => {
      expect(noteOn(0, 60, 127)[1]).toBe(60);
      expect(noteOn(0, 0, 127)[1]).toBe(0);
      expect(noteOn(0, 140, 127)[1]).toBe(140);
    });

    test('has the correct velocity (if specified)', () => {
      expect(noteOn(0, 60, 0)[2]).toBe(0);
      expect(noteOn(0, 60, 127)[2]).toBe(127);
      expect(noteOn(15, 60)[2]).toBe(127);
    });
  });

  describe('with a callback', () => {
    test.todo('test');
  });
});

describe('keyPressure()', () => {});

describe('controlChange()', () => {
  describe('with data', () => {
    test('constructs a "control change" message', () => {
      const message = controlChange(0, 0, 100);
      expect(Array.isArray(message)).toBe(true);
      expect(message).toHaveLength(3);
      expect(message[0]).toBe(176);
    });
  });
});

describe('programChange()', () => {});

describe('channelPressure()', () => {});

describe('pitchBend()', () => {});

describe('allSoundOff()', () => {});

describe('resetControllers()', () => {});

describe('localControl()', () => {});
