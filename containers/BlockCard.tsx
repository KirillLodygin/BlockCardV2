import React, { useCallback } from 'react';

import { analytics, dtrumEnterAction } from '@common/analytics';
import { CMS_RESOURCE } from '@common/content/headlessCmsIdMap';
import { useContent } from '@common/content/use-content-new';
import { CardEntity } from '@modules/DebitAndCreditCards';

import { getAnalyticsEntityByProduct, AnalyticsOptionsType, AnalyticAction, CARD_ACTION_TYPE } from '../analytics';
import { BlockCardLayoutSkeleton } from '../components/BlockCardLayoutSkeleton';
import { useAnalyticActions } from '../hooks';
import { ContentCardBlock, ContentCreditCardBlock } from '../types';
import { mapCreditCmsContent } from '../utils/mapCreditCmsContent';
import { MSABlockCard } from './MSABlockCard';

type Props = {
  card: CardEntity;
  isDebitProduct: boolean;
  onClose: () => void;
  onClickIssueCard: () => void;
  isTempBlockCardScenarioAvailable?: boolean;
};

export const BlockCard = ({
  card: { id, shortNumber = '', displayName = '', isVirtualCard = false },
  isDebitProduct,
  onClose,
  onClickIssueCard,
  isTempBlockCardScenarioAvailable = true,
}: Props) => {
  const { getGoalParamsByAction, getDtrumActionNameByAction, analyticsMap } = useAnalyticActions(
    getAnalyticsEntityByProduct(isDebitProduct, CARD_ACTION_TYPE.BLOCK),
  );

  const handleAnalyticsEvent = useCallback(
    (action: AnalyticAction, options: AnalyticsOptionsType) => {
      analytics.send(getGoalParamsByAction(action, options));
      dtrumEnterAction(getDtrumActionNameByAction(action, options));
    },
    [getDtrumActionNameByAction, getGoalParamsByAction],
  );

  const debitCmsContent = useContent<ContentCardBlock>(CMS_RESOURCE.tempBlockDebitCard);
  const creditCmsContent = useContent<ContentCreditCardBlock>(CMS_RESOURCE.creditCardNewBlockUnblockCard);

  const formattedDebitCmsContent = debitCmsContent;
  const formattedCreditCmsContent = creditCmsContent ? mapCreditCmsContent(creditCmsContent) : null;

  const content = isDebitProduct ? formattedDebitCmsContent : formattedCreditCmsContent;

  return !content ? (
    <BlockCardLayoutSkeleton />
  ) : (
    <MSABlockCard
      cardId={id}
      cardName={displayName}
      content={content}
      isTempBlockCardScenarioAvailable={isTempBlockCardScenarioAvailable}
      onBack={onClose}
      onIssueCard={onClickIssueCard}
      shortNumber={shortNumber}
      isVirtualCard={isVirtualCard}
      analyticsCb={handleAnalyticsEvent}
      analyticsMap={analyticsMap}
    />
  );
};
