type Props = {
  expirationTime: number;
  currentDateSeconds: number;
};

export const TIMER_TIMEOUT = 43;

export const getTimeoutValue = ({ expirationTime, currentDateSeconds }: Props) => {
  if (expirationTime <= currentDateSeconds) {
    return TIMER_TIMEOUT;
  }

  return expirationTime - currentDateSeconds;
};
