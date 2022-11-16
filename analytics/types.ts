import { NOTIFICATION_TYPE } from '@vtb/ui-kit/adaptive/molecules/notification';

import { LOCK_OPERATION } from '../types';
import {
  CREDIT_ACTION_PERMANENT_BLOCK_STRING,
  CREDIT_ACTION_TEMPORARY_BLOCK_STRING,
  CREDIT_CARD_ACTION_MAP,
  CREDIT_PRODUCT,
  CREDIT_STREAM,
  DEBIT_ACTION_PERMANENT_BLOCK_STRING,
  DEBIT_ACTION_TEMPORARY_BLOCK_STRING,
  DEBIT_CARD_ACTION_MAP,
  DEBIT_PRODUCT,
  DEBIT_STREAM,
} from './constants';

export type AnalyticAction = {
  text: string;
  target: string;
};

// для аналитики
export enum CARD_ACTION_TYPE {
  UNFREEZE = 'unfreeze',
  BLOCK = 'block',
}

export type AnalyticsMapType = {
  [x in string]: {
    [x in string]: {
      text: string;
      target: string;
    };
  };
};

export type AnalyticsEntityType = {
  stream: typeof CREDIT_STREAM | typeof DEBIT_STREAM;
  product: typeof CREDIT_PRODUCT | typeof DEBIT_PRODUCT;
  getActionEntityString: (
    blockType: LOCK_OPERATION,
  ) =>
    | typeof DEBIT_ACTION_TEMPORARY_BLOCK_STRING
    | typeof DEBIT_ACTION_PERMANENT_BLOCK_STRING
    | typeof CREDIT_ACTION_TEMPORARY_BLOCK_STRING
    | typeof CREDIT_ACTION_PERMANENT_BLOCK_STRING;
  analyticsMap: AnalyticsMapType;
  type: typeof CARD_ACTION_TYPE.BLOCK | typeof CARD_ACTION_TYPE.UNFREEZE;
};

enum BLOCK_DEBIT_CARD_SCREEN {
  CHECK = 'CHECK',
  RESULT = 'RESULT',
  START = 'START',
}

export type NotificationType = typeof NOTIFICATION_TYPE.info | typeof NOTIFICATION_TYPE.fail;

export type AnalyticsOptionsType = {
  blockType: LOCK_OPERATION;
  cardName: string;
  screenData: BLOCK_DEBIT_CARD_SCREEN;
  notificationType?: NotificationType;
  reason?: string;
};

export type DebitAnalyticsMapType = typeof DEBIT_CARD_ACTION_MAP;
export type CreditAnalyticsMapType = typeof CREDIT_CARD_ACTION_MAP;

export type NotificationKeys = keyof typeof DEBIT_CARD_ACTION_MAP;
