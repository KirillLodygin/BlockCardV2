import { getTimeoutValue, TIMER_TIMEOUT } from './getTimeoutValue';

describe('getTimeoutValue', () => {
  it.each([{ expirationTime: 144, currentDateSeconds: 165 }])('returns TIMER_TIMEOUT value', (v) => {
    expect(getTimeoutValue(v)).toBe(TIMER_TIMEOUT);
  });

  it.each([{ expirationTime: 165, currentDateSeconds: 144 }])(
    'returns expirationTime and currentDateSeconds difference',
    (v) => {
      expect(getTimeoutValue(v)).toBe(165 - 144);
    },
  );
});
