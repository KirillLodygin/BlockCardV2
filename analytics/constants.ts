import { BLOCK_DEBIT_CARD_SCREEN, NOTIFICATION_TYPE, LOCK_OPERATION } from '../types';

export const BlockTypesForDtrumActionName = {
  [LOCK_OPERATION.TEMPORARY]: 'Временно',
  [LOCK_OPERATION.PERMANENT]: 'Навсегда',
};

export const DEBIT_STREAM = 'Стрим - Дебетовые карты и счета';
export const CREDIT_STREAM = 'Стрим - Кредитные карты и овердрафты';

export const DEBIT_PRODUCT = 'ВТБ онлайн. Главная. Мои продукты. Счета и карты. Дебетовая карта';
export const CREDIT_PRODUCT = ' ВТБ онлайн. Главная. Мои продукты. Счета и карты. Кредитные карты';

export const CATEGORY = 'Клики по кнопке';

export const ACTION_BLOCK_CARD = 'Страница Блокировки карты.';
export const ACTION_UNFREEZE_CARD = 'Страница Разблокировки карты.';

export const ACTION_BLOCK_TYPE = 'Период блокировки:';

export const ACTION_BLOCK_REASON = 'Причина блокировки:';

export enum ACTION_NAME_PARAM {
  ACTION = 'Action',
  BLOCK_TYPE = 'BlockType',
  CARD_NAME = 'CardName',
  PAGE = 'Page',
  REASON = 'Reason',
}

// кредитные карты не логируют результирующий экран
// todo-mhorkov аналитика для разблокировки дебетовых карточек?
export const DEBIT_CARD_ACTION_MAP = {
  [BLOCK_DEBIT_CARD_SCREEN.START]: {
    blockCard: {
      text: 'Клик по кнопке Заблокировать',
      target: '7996',
    },
  },
  [BLOCK_DEBIT_CARD_SCREEN.CHECK]: {
    confirm: {
      text: 'Клик по Подтвердить',
      target: '7997',
    },
    newCode: {
      text: 'Клик по кнопке Получить новый код',
      target: '7998',
    },
  },
  [NOTIFICATION_TYPE.SUCCESS]: {
    clear: {
      text: 'Клик по кнопке Понятно',
      target: '7999',
    },
    issueCard: {
      text: 'Клик по кнопке Выпустить дебетовую карту',
      target: '8000',
    },
    unfreeze: {
      text: 'Клик по кнопке Понятно',
      target: '8003',
    },
  },
  [NOTIFICATION_TYPE.ERROR]: {
    clear: {
      text: 'Клик по кнопке Понятно',
      target: '8001',
    },
    unfreeze: {
      text: 'Клик по кнопке Понятно',
      target: '8004',
    },
  },
  [NOTIFICATION_TYPE.FAIL]: {
    clear: {
      text: 'Клик по кнопке Закрыть',
      target: '8002',
    },
    unfreeze: {
      text: 'Клик по кнопке Закрыть',
      target: '8002',
    },
  },
};

export const CREDIT_CARD_ACTION_MAP = {
  [BLOCK_DEBIT_CARD_SCREEN.START]: {
    blockCard: {
      text: 'Клик по кнопке Заблокировать карту',
      target: '2564',
    },
    // клик по кнопке заблокировать навсегда, когда доступна только постоянная блокировка
    blockCardPermanent: {
      text: 'Клик по кнопке Заблокировать карту',
      target: '2578',
    },
  },
  // подтвердить блокировку
  [BLOCK_DEBIT_CARD_SCREEN.CHECK]: {
    confirm: {
      text: 'Клик по кнопке Подтвердить',
      target: '2566',
    },
    // подтвердить разблокировку
    confirmUnfreeze: {
      text: 'Клик по кнопке Подтвердить',
      target: '2574',
    },
  },
};

export const DEBIT_ACTION_PERMANENT_BLOCK_STRING = `${DEBIT_STREAM} | ${DEBIT_PRODUCT} | ${CATEGORY} | ${ACTION_BLOCK_CARD} <${ACTION_NAME_PARAM.PAGE}> | <${ACTION_NAME_PARAM.CARD_NAME}> | <${ACTION_NAME_PARAM.ACTION}> | ${ACTION_BLOCK_TYPE} <${ACTION_NAME_PARAM.BLOCK_TYPE}> | ${ACTION_BLOCK_REASON} <${ACTION_NAME_PARAM.REASON}>`;
export const CREDIT_ACTION_PERMANENT_BLOCK_STRING = `${CREDIT_STREAM} | ${CREDIT_PRODUCT} | ${CATEGORY} | ${ACTION_BLOCK_CARD} <${ACTION_NAME_PARAM.PAGE}> | <${ACTION_NAME_PARAM.CARD_NAME}> | <${ACTION_NAME_PARAM.ACTION}> | ${ACTION_BLOCK_TYPE} <${ACTION_NAME_PARAM.BLOCK_TYPE}> | ${ACTION_BLOCK_REASON} <${ACTION_NAME_PARAM.REASON}>`;

export const DEBIT_ACTION_TEMPORARY_BLOCK_STRING = `${DEBIT_STREAM} | ${DEBIT_PRODUCT} | ${CATEGORY} | ${ACTION_BLOCK_CARD} <${ACTION_NAME_PARAM.PAGE}> | <${ACTION_NAME_PARAM.CARD_NAME}> | <${ACTION_NAME_PARAM.ACTION}> | ${ACTION_BLOCK_TYPE} <${ACTION_NAME_PARAM.BLOCK_TYPE}>`;
export const CREDIT_ACTION_TEMPORARY_BLOCK_STRING = `${CREDIT_STREAM} | ${CREDIT_PRODUCT} | ${CATEGORY} | ${ACTION_BLOCK_CARD} <${ACTION_NAME_PARAM.PAGE}> | <${ACTION_NAME_PARAM.CARD_NAME}> | <${ACTION_NAME_PARAM.ACTION}> | ${ACTION_BLOCK_TYPE} <${ACTION_NAME_PARAM.BLOCK_TYPE}>`;

export const CREDIT_UNFREEZE_ACTION_STRING = `${CREDIT_STREAM} | ${CREDIT_PRODUCT} | ${CATEGORY} | ${ACTION_UNFREEZE_CARD} <${ACTION_NAME_PARAM.PAGE}> | <${ACTION_NAME_PARAM.CARD_NAME}> | <${ACTION_NAME_PARAM.ACTION}>`;
export const DEBIT_UNFREEZE_ACTION_STRING = `${DEBIT_STREAM} | ${DEBIT_PRODUCT} | ${CATEGORY} | ${ACTION_UNFREEZE_CARD} <${ACTION_NAME_PARAM.PAGE}> | <${ACTION_NAME_PARAM.CARD_NAME}> | <${ACTION_NAME_PARAM.ACTION}>`;
