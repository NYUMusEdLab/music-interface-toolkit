const { noteOn, noteOff } = require('./channelMessages.js');

describe('noteOff()');

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

describe('noteOn()');

describe('keyPressure()');

describe('controlChange()');

describe('programChange()');

describe('channelPressure()');

describe('pitchBend()');

describe('allSoundOff()');

describe('resetControllers()');

describe('localControl()');
