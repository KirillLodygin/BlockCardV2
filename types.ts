import { DropdownValue } from '@vtb/ui-kit/adaptive/molecules/dropdown/_baseDropdown/typesDropdown';

import { ServiceListMsa } from '@modules/CreditCard';
import { EntityByType } from '@modules/DebitAndCreditCards';

export type BlockCardReqeustDataType = {
  secureCode: string;
  transactionId: string;
};

export enum SCENARIO_ASYNC_EVENT_BLOCK_CARD {
  AUTHORIZE = 'card-lock-authorize',
  AUTHORIZE_UNFREEZE = 'card-unfreeze-authorize',
  COMMIT = 'card-lock-commit',
  COMMIT_UNFREEZE = 'card-unfreeze-commit',
  FREEZE = 'card-freeze',
  UNFREEZE = 'card-unfreeze',
}

export type AsyncEventBlockDebitCardResponse = {
  body: AuthorizeResponseType | BlockCardResponseType;
  status: number;
  type: SCENARIO_ASYNC_EVENT_BLOCK_CARD;
};

export type BlockCardResponseType = {
  maskedCardNumber: string;
};

export type AuthorizeResponseType = {
  expirationTime: number;
  phone: string;
  transactionId: string;
};

export type RowTableData = {
  value: string | DropdownValue | null;
  title: string;
};

export enum BLOCK_DEBIT_CARD_SCREEN {
  CHECK = 'CHECK',
  RESULT = 'RESULT',
  START = 'START',
}

export enum BLOCK_TABLE_DATA_TITLE {
  BLOCK_REASON = 'blockReason',
  CARD_TITLE = 'blockCardTitle',
  OPERATION_TYPE = 'operationType',
  SHROT_CRAD_NEMBER = 'shortNumber',
}

export enum LOCK_OPERATION {
  PERMANENT = 'permanent',
  TEMPORARY = 'temporary',
  UNFREEZE = 'unfreeze',
}

export enum BUTTONS_LOCK {
  BACK = 'back',
  CONTINUE = 'continue',
  RESEND = 'resend',
  SECONDARY = 'secondary',
}

export enum NOTIFICATION_TYPE {
  AUTH_ERROR = 'authError',
  ERROR = 'error',
  FAIL = 'fail',
  INFO = 'info',
  SUCCESS = 'success',
}

export enum CARD_TYPE {
  DIGITAL = 'digital',
  PLASTIC = 'plastic',
}

export enum LOCK_REASON {
  LOSS = 'loss',
  THEFT = 'theft',
  FRAUD = 'fraud',
  STUFFY = 'stuffy',
  OTHER = 'other',
}

export type ButtonsLock = {
  isFail?: boolean;
  title: string;
  type: BUTTONS_LOCK;
};

export type NotificationLockResult = {
  description: string;
  operations: LOCK_OPERATION[];
  title?: string;
  type: NOTIFICATION_TYPE;
};

export type LockTypeSelection = {
  buttons: ButtonsLock[];
  buttonsRadio: {
    id: LOCK_OPERATION;
    text: string;
  }[];
  dropdown: {
    elements: {
      id: LOCK_REASON;
      cardTypes: CARD_TYPE[];
      text: string;
    }[];
    label: string;
  };
  inputLabel: string;
  notifications: NotificationLockResult[];
  title: string;
};

export type LockConfirmationScreen = {
  buttons: ButtonsLock[];
  inputErrorText: string;
  inputLabel: string;
  operationName: string;
  phoneInfo: string;
  timerInfo: string;
  table: {
    title: string;
    type: BLOCK_TABLE_DATA_TITLE;
  }[];
  title: string;
};

export type LockResultScreen = {
  buttons: ButtonsLock[];
  notifications: NotificationLockResult[];
};

export type ContentCardBlock = {
  lockTypeSelectionScreen: LockTypeSelection;
  lockConfirmationScreen: LockConfirmationScreen;
  lockResultScreen: LockResultScreen;
};

export type ContentCreditCardBlock = {
  BlockCardHeader?: string;
  BlockCardTemp?: string;
  BlockCardConst?: string;
  BlockCardButton?: string;
  BlockCardDescription?: string;
  TempBlockCardDescription?: string;
  BlockCardConfirmButton?: string;
  BlockCardConfirmHeader?: string;
  BlockCardConfirmTitle?: string;
  BlockCardConfirmNumber?: string;
  BlockCardConfirmType?: string;
  BlockCardConfirmReason?: string;
  SuccessBlockCardHeader?: string;
  SuccessBlockCardDescription?: string;
  SuccessButton?: string;
  ErrorBlockCardHeader?: string;
  ErrorBlockCardDescription?: string;
  ErrorButton?: string;
  NetworkErrorHeader?: string;
  NetworkErrorDescription?: string;
  NetworkErrorAgainButton?: string;
  TempBlockCardHeader?: string;
  SuccessTempBlockCardDescription?: string;
  UnblockCardHeader?: string;
  UnblockCardTitle?: string;
  UnblockCardNumber?: string;
  UnblockCardButton?: string;
  SuccessUnblockCardHeader?: string;
  SuccessUnblockCardDescription?: string;
  ErrorUnblockCardHeader?: string;
  ErrorUnblockCardDescription?: string;
  BlockUserHeader?: string;
  EBlockUserDescription?: string;
  CauseBlockArray?: {
    id?: 'first' | 'second' | 'third' | 'fourth';
    title?: string;
    enabled?: boolean;
    reasonFor?: 'PLASTIC' | 'ALL';
  }[];
};

export type CreditCard = EntityByType<'CreditCard'> & { serviceList?: ServiceListMsa };
