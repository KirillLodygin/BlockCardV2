import { LOCK_OPERATION } from '../types';
import {
  BlockTypesForDtrumActionName,
  ACTION_BLOCK_REASON,
  ACTION_BLOCK_TYPE,
  ACTION_BLOCK_CARD,
  ACTION_NAME_PARAM,
  ACTION_UNFREEZE_CARD,
  CATEGORY,
  CREDIT_ACTION_PERMANENT_BLOCK_STRING,
  CREDIT_ACTION_TEMPORARY_BLOCK_STRING,
  CREDIT_CARD_ACTION_MAP,
  CREDIT_PRODUCT,
  CREDIT_STREAM,
  CREDIT_UNFREEZE_ACTION_STRING,
  DEBIT_ACTION_PERMANENT_BLOCK_STRING,
  DEBIT_ACTION_TEMPORARY_BLOCK_STRING,
  DEBIT_CARD_ACTION_MAP,
  DEBIT_PRODUCT,
  DEBIT_STREAM,
  DEBIT_UNFREEZE_ACTION_STRING,
} from './constants';
import { AnalyticsEntityType, CARD_ACTION_TYPE } from './types';

type DTRUM_PARAMS = {
  [ACTION_NAME_PARAM.ACTION]: string;
  [ACTION_NAME_PARAM.BLOCK_TYPE]?: string;
  [ACTION_NAME_PARAM.CARD_NAME]: string;
  [ACTION_NAME_PARAM.PAGE]: string;
  [ACTION_NAME_PARAM.REASON]?: string;
  stream: typeof CREDIT_STREAM | typeof DEBIT_STREAM;
  product: typeof CREDIT_PRODUCT | typeof DEBIT_PRODUCT;
};

export const getDtrumActionName = (
  params: DTRUM_PARAMS,
  actionEntityString:
    | typeof DEBIT_ACTION_TEMPORARY_BLOCK_STRING
    | typeof DEBIT_ACTION_PERMANENT_BLOCK_STRING
    | typeof CREDIT_ACTION_TEMPORARY_BLOCK_STRING
    | typeof CREDIT_ACTION_PERMANENT_BLOCK_STRING,
) =>
  // @ts-ignore
  actionEntityString.replace(/<[a-zA-Z]*>/gm, (el: string) => {
    const subStr = el.slice(1, -1) as ACTION_NAME_PARAM;

    return params[subStr];
  });

type GoalParams = {
  action: string;
  cardName: string;
  page: string;
  reasonParams: Record<string, string>[];
  target: string;
  stream: typeof CREDIT_STREAM | typeof DEBIT_STREAM;
  product: typeof CREDIT_PRODUCT | typeof DEBIT_PRODUCT;
  type: typeof CARD_ACTION_TYPE.BLOCK | typeof CARD_ACTION_TYPE.UNFREEZE;
};

export const getGoalParams = ({ action, cardName, page, reasonParams, target, stream, product, type }: GoalParams) => {
  const actionsParams = type === CARD_ACTION_TYPE.BLOCK ? { [action]: reasonParams } : action;

  return {
    target,
    stream,
    product,
    [CATEGORY]: {
      [`${type === CARD_ACTION_TYPE.BLOCK ? ACTION_BLOCK_CARD : ACTION_UNFREEZE_CARD} ${page}`]: {
        [cardName]: actionsParams,
      },
    },
  };
};

export const getAnalyticsEntityByProduct = (
  isDebitProduct: boolean | null,
  type: CARD_ACTION_TYPE.BLOCK | CARD_ACTION_TYPE.UNFREEZE,
): AnalyticsEntityType => {
  const actionString = {
    debitCard: {
      [LOCK_OPERATION.PERMANENT]: DEBIT_ACTION_PERMANENT_BLOCK_STRING,
      [LOCK_OPERATION.TEMPORARY]: DEBIT_ACTION_TEMPORARY_BLOCK_STRING,
      [LOCK_OPERATION.UNFREEZE]: DEBIT_UNFREEZE_ACTION_STRING,
    },
    creditCard: {
      [LOCK_OPERATION.PERMANENT]: CREDIT_ACTION_PERMANENT_BLOCK_STRING,
      [LOCK_OPERATION.TEMPORARY]: CREDIT_ACTION_TEMPORARY_BLOCK_STRING,
      [LOCK_OPERATION.UNFREEZE]: CREDIT_UNFREEZE_ACTION_STRING,
    },
  };

  return isDebitProduct
    ? {
        stream: DEBIT_STREAM,
        product: DEBIT_PRODUCT,
        getActionEntityString: (blockType: LOCK_OPERATION) => actionString.debitCard[blockType],
        analyticsMap: DEBIT_CARD_ACTION_MAP,
        type,
      }
    : {
        stream: CREDIT_STREAM,
        product: CREDIT_PRODUCT,
        getActionEntityString: (blockType: LOCK_OPERATION) => actionString.creditCard[blockType],
        analyticsMap: CREDIT_CARD_ACTION_MAP,
        type,
      };
};

export const getBBCodeTypeLink = (element: HTMLElement): string | undefined =>
  (element.tagName && element.tagName.toLowerCase() === 'a' && element.getAttribute('data-name')) || undefined;

export const getReasonParams = (blockType: LOCK_OPERATION, reason?: string): Record<string, string>[] => {
  const reasonParams: Record<string, string>[] = [];

  if (blockType !== LOCK_OPERATION.UNFREEZE) {
    reasonParams.push({ [ACTION_BLOCK_TYPE]: BlockTypesForDtrumActionName[blockType] });
  }

  if (reason && blockType === LOCK_OPERATION.PERMANENT) {
    reasonParams.push({ [ACTION_BLOCK_REASON]: reason });
  }

  return reasonParams;
};
