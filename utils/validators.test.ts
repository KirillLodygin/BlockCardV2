import { isNumeric } from './validators';

describe('isNumeric', () => {
  it.each(['1', '1234567890', '001234'])('returns true with value=%s', (v) => {
    expect(isNumeric(v)).toBe(true);
  });

  it.each(['-23', 'abcd', '123a', '1234n', '1234e', '123.4', '', '    '])('returns false with value=%s', (v) => {
    expect(isNumeric(v)).toBe(false);
  });
});
