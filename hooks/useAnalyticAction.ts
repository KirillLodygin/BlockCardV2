import { useMemo } from 'react';

import { NOTIFICATION_TYPE } from '@vtb/ui-kit/adaptive/molecules/notification';

import { AnalyticsAction } from '@common/analytics/analytics.types';

import {
  getReasonParams,
  AnalyticAction,
  getDtrumActionName,
  getGoalParams,
  AnalyticsEntityType,
  AnalyticsOptionsType,
  BlockTypesForDtrumActionName,
} from '../analytics';
import { BLOCK_DEBIT_CARD_SCREEN, LOCK_OPERATION } from '../types';

const getPageForDtrumActionName = ({ screenData, notificationType, blockType }: AnalyticsOptionsType) => {
  if (screenData === BLOCK_DEBIT_CARD_SCREEN.START) {
    return 'Выбор типа блокировки';
  }

  if (screenData === BLOCK_DEBIT_CARD_SCREEN.CHECK) {
    return 'Подтверждение блокировки';
  }

  if (notificationType === NOTIFICATION_TYPE.fail) {
    return blockType === LOCK_OPERATION.UNFREEZE ? 'Не удалось разблокировать карту' : 'Не удалось заблокировать карту';
  }

  if (blockType === LOCK_OPERATION.UNFREEZE) {
    return 'Успешно разблокирована';
  }

  return 'Успешно заблокирована';
};

export const useAnalyticActions = ({
  stream,
  product,
  getActionEntityString,
  analyticsMap,
  type,
}: AnalyticsEntityType): {
  analyticsMap: AnalyticsEntityType['analyticsMap'];
  getGoalParamsByAction: (action: AnalyticAction, options: AnalyticsOptionsType) => AnalyticsAction;
  getDtrumActionNameByAction: (action: AnalyticAction, options: AnalyticsOptionsType) => string;
} => {
  return useMemo(() => {
    return {
      analyticsMap,
      getGoalParamsByAction: (action: AnalyticAction, options: AnalyticsOptionsType) =>
        getGoalParams({
          action: action.text,
          cardName: options.cardName,
          page: getPageForDtrumActionName(options),
          reasonParams: getReasonParams(options.blockType, options.reason),
          target: action.target,
          type,
          stream,
          product,
        }),
      getDtrumActionNameByAction: (action: AnalyticAction, options: AnalyticsOptionsType) =>
        getDtrumActionName(
          {
            Action: action.text,
            BlockType:
              options.blockType !== LOCK_OPERATION.UNFREEZE
                ? BlockTypesForDtrumActionName[options.blockType]
                : undefined,
            CardName: options.cardName,
            Page: getPageForDtrumActionName(options),
            Reason: options.reason,
            stream,
            product,
          },
          getActionEntityString(options.blockType),
        ),
    };
  }, [getActionEntityString, analyticsMap, product, stream, type]);
};
