const { noteOn, noteOff } = require('./index.js');

describe('noteOn()', () => {
  describe('with data', () => {
    test('constructs a "note on" message', () => {
      const message = noteOn(0, 60, 127);
      expect(Array.isArray(message)).toBe(true);
      expect(message).toHaveLength(3);
      expect(message[0]).toBe(144);
    });
  });

  describe('with a callback', () => {
    test.todo('test');
  });
});
