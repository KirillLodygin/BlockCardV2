import {
  BLOCK_TABLE_DATA_TITLE,
  BUTTONS_LOCK,
  CARD_TYPE,
  ContentCardBlock,
  ContentCreditCardBlock,
  LOCK_OPERATION,
  LOCK_REASON,
  NOTIFICATION_TYPE,
} from '../types';

const mapContentToBBCode = (str: string): string => str.replace(/([{\[]([^>\]]+)[}\]])/gi, '<value>');

export const mapCreditCmsContent = (
  {
    BlockCardHeader = '',
    BlockCardTemp = '',
    BlockCardConst = '',
    BlockCardButton = '',
    BlockCardDescription = '',
    TempBlockCardDescription = '',
    BlockCardConfirmButton = '',
    BlockCardConfirmHeader = '',
    BlockCardConfirmTitle = '',
    BlockCardConfirmNumber = '',
    BlockCardConfirmType = '',
    BlockCardConfirmReason = '',
    SuccessBlockCardHeader = '',
    SuccessBlockCardDescription = '',
    SuccessButton = '',
    ErrorBlockCardHeader = '',
    ErrorBlockCardDescription = '',
    ErrorButton = '',
    NetworkErrorHeader = '',
    NetworkErrorDescription = '',
    NetworkErrorAgainButton = '',
    TempBlockCardHeader = '',
    SuccessTempBlockCardDescription = '',
    UnblockCardHeader = '',
    UnblockCardTitle = '',
    UnblockCardNumber = '',
    UnblockCardButton = '',
    SuccessUnblockCardHeader = '',
    SuccessUnblockCardDescription = '',
    ErrorUnblockCardHeader = '',
    ErrorUnblockCardDescription = '',
    BlockUserHeader = '',
    EBlockUserDescription = '',
    CauseBlockArray = [],
  }: ContentCreditCardBlock,
  isBlockOperation = false,
): ContentCardBlock => ({
  lockTypeSelectionScreen: {
    title: BlockCardHeader,
    buttons: [
      {
        title: BlockCardButton,
        type: BUTTONS_LOCK.CONTINUE,
      },
      {
        title: 'Назад',
        type: BUTTONS_LOCK.BACK,
      },
    ],
    inputLabel: 'Номер блокируемой карты',
    notifications: [
      {
        description: BlockCardDescription,
        operations: [LOCK_OPERATION.PERMANENT],
        type: NOTIFICATION_TYPE.INFO,
      },
      {
        description: TempBlockCardDescription,
        operations: [LOCK_OPERATION.TEMPORARY],
        type: NOTIFICATION_TYPE.INFO,
      },
    ],
    buttonsRadio: [
      {
        id: LOCK_OPERATION.TEMPORARY,
        text: BlockCardTemp,
      },
      {
        id: LOCK_OPERATION.PERMANENT,
        text: BlockCardConst,
      },
    ],
    dropdown: {
      label: BlockCardConfirmReason,
      elements: CauseBlockArray.filter(({ enabled }) => enabled).map(({ id, title = '', reasonFor }) => {
        switch (id) {
          case 'first': {
            return {
              id: LOCK_REASON.LOSS,
              text: title,
              cardTypes: reasonFor === 'PLASTIC' ? [CARD_TYPE.PLASTIC] : [CARD_TYPE.DIGITAL, CARD_TYPE.PLASTIC],
            };
          }
          case 'second': {
            return {
              id: LOCK_REASON.THEFT,
              text: title,
              cardTypes: reasonFor === 'PLASTIC' ? [CARD_TYPE.PLASTIC] : [CARD_TYPE.DIGITAL, CARD_TYPE.PLASTIC],
            };
          }
          case 'third': {
            return {
              id: LOCK_REASON.STUFFY,
              text: title,
              cardTypes: reasonFor === 'PLASTIC' ? [CARD_TYPE.PLASTIC] : [CARD_TYPE.DIGITAL, CARD_TYPE.PLASTIC],
            };
          }
          default:
            return {
              id: LOCK_REASON.OTHER,
              text: title,
              cardTypes: reasonFor === 'PLASTIC' ? [CARD_TYPE.PLASTIC] : [CARD_TYPE.DIGITAL, CARD_TYPE.PLASTIC],
            };
        }
      }),
    },
  },
  lockConfirmationScreen: {
    title: isBlockOperation ? BlockCardConfirmHeader : UnblockCardHeader,
    buttons: [
      {
        title: isBlockOperation ? BlockCardConfirmButton : UnblockCardButton,
        type: BUTTONS_LOCK.CONTINUE,
      },
      {
        title: 'Получить новый код',
        type: BUTTONS_LOCK.RESEND,
      },
      {
        title: 'Назад',
        type: BUTTONS_LOCK.BACK,
      },
    ],
    inputErrorText: 'Неправильный код',
    inputLabel: 'Введите СМС/push-код',
    operationName: isBlockOperation ? BlockCardConfirmTitle : UnblockCardTitle,
    phoneInfo: 'СМС/push-код отправлен на номер телефона <phoneNumber>',
    timerInfo: 'Выслать код повторно через: <seconds> сек',
    table: [
      {
        title: 'Название операции',
        type: BLOCK_TABLE_DATA_TITLE.CARD_TITLE,
      },
      {
        title: isBlockOperation ? BlockCardConfirmNumber : UnblockCardNumber,
        type: BLOCK_TABLE_DATA_TITLE.SHROT_CRAD_NEMBER,
      },
      {
        title: BlockCardConfirmType,
        type: BLOCK_TABLE_DATA_TITLE.OPERATION_TYPE,
      },
      {
        title: BlockCardConfirmReason,
        type: BLOCK_TABLE_DATA_TITLE.BLOCK_REASON,
      },
    ],
  },
  lockResultScreen: {
    buttons: [
      {
        isFail: false,
        title: SuccessButton,
        type: BUTTONS_LOCK.CONTINUE,
      },
      {
        isFail: true,
        title: NetworkErrorAgainButton,
        type: BUTTONS_LOCK.CONTINUE,
      },
      {
        isFail: true,
        title: ErrorButton,
        type: BUTTONS_LOCK.SECONDARY,
      },
    ],
    notifications: [
      {
        title: mapContentToBBCode(SuccessBlockCardHeader),
        description: SuccessBlockCardDescription,
        operations: [LOCK_OPERATION.PERMANENT],
        type: NOTIFICATION_TYPE.SUCCESS,
      },
      {
        title: mapContentToBBCode(TempBlockCardHeader),
        description: SuccessTempBlockCardDescription,
        operations: [LOCK_OPERATION.TEMPORARY],
        type: NOTIFICATION_TYPE.SUCCESS,
      },
      {
        title: mapContentToBBCode(SuccessUnblockCardHeader),
        description: SuccessUnblockCardDescription,
        operations: [LOCK_OPERATION.UNFREEZE],
        type: NOTIFICATION_TYPE.SUCCESS,
      },
      {
        title: ErrorUnblockCardHeader,
        description: ErrorUnblockCardDescription,
        operations: [LOCK_OPERATION.UNFREEZE],
        type: NOTIFICATION_TYPE.ERROR,
      },
      {
        title: ErrorBlockCardHeader,
        description: ErrorBlockCardDescription,
        operations: [LOCK_OPERATION.PERMANENT, LOCK_OPERATION.TEMPORARY],
        type: NOTIFICATION_TYPE.ERROR,
      },
      {
        title: NetworkErrorHeader,
        description: NetworkErrorDescription,
        operations: [LOCK_OPERATION.PERMANENT, LOCK_OPERATION.TEMPORARY, LOCK_OPERATION.UNFREEZE],
        type: NOTIFICATION_TYPE.FAIL,
      },
      // TODO-svetlov: нереализовано в коде ошибка при неправильно введеном коде 3 раза
      {
        title: BlockUserHeader,
        description: EBlockUserDescription,
        operations: [LOCK_OPERATION.PERMANENT, LOCK_OPERATION.UNFREEZE],
        type: NOTIFICATION_TYPE.AUTH_ERROR,
      },
    ],
  },
});
