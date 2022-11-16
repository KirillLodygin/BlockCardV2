import { NOTIFICATION_TYPE as BASE_NOTIFICATION_TYPE } from '@vtb/ui-kit/adaptive/molecules/notification';

import { NOTIFICATION_TYPE } from '../types';

export const getNotificationType = (type: NOTIFICATION_TYPE) => {
  switch (type) {
    case NOTIFICATION_TYPE.INFO:
    case NOTIFICATION_TYPE.SUCCESS: {
      return BASE_NOTIFICATION_TYPE.info;
    }

    default: {
      return BASE_NOTIFICATION_TYPE.fail;
    }
  }
};
