import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { analytics, dtrumEnterAction } from '@common/analytics';
import { CMS_RESOURCE } from '@common/content/headlessCmsIdMap';
import { useContent } from '@common/content/use-content-new';
import { ACCESS_MODES, COMPONENTS_KEYS, HEALTHCHECKS_KEYS, useAccessMode } from '@common/coreSettings';
import { TEMPORARY_BLOCK_CREDIT_CARD, TEMPORARY_BLOCK_DEBIT_CARD, useActiveFeature } from '@common/featureFlags';
import {
  useRouterSelector,
  getCardEntityByRoute,
  getIsCardType,
  EntityByType,
  useRefetchArchivalProducts,
} from '@modules/DebitAndCreditCards';
import { useIsDebitProductByRoute } from '@modules/DebitProducts';
import { getIsPortfolioError } from '@modules/Portfolios';

import { AnalyticAction, getAnalyticsEntityByProduct, AnalyticsOptionsType, CARD_ACTION_TYPE } from '../analytics';
import { CheckScreenSkeleton } from '../components/CheckScreenSkeleton';
import { ResultScreenSkeleton } from '../components/ResultScreenSkeleton';
import { DefaultErrorBlock } from '../components/components';
import { useAnalyticActions } from '../hooks';
import { useIsUnblockScenarioEnabled } from '../hooks/useIsScenarioEnabled';
import { ContentCardBlock, ContentCreditCardBlock } from '../types';
import { getIsUnblockEnabledForCreditCard } from '../utils/getIsUnblockEnabledForCreditCard';
import { mapCreditCmsContent } from '../utils/mapCreditCmsContent';
import { BlockCardScenarioContainer } from './BlockCardScenarioContainer';
import { UnblockCardView } from './UnblockCardView';

const UnfreezeCardAvailable = () => {
  useRefetchArchivalProducts();

  const history = useHistory();

  const isDebitProduct = useIsDebitProductByRoute();

  const { getGoalParamsByAction, getDtrumActionNameByAction, analyticsMap } = useAnalyticActions(
    getAnalyticsEntityByProduct(isDebitProduct, CARD_ACTION_TYPE.UNFREEZE),
  );

  const handleAnalyticsEvent = useCallback(
    (action: AnalyticAction, options: AnalyticsOptionsType) => {
      analytics.send(getGoalParamsByAction(action, options));
      dtrumEnterAction(getDtrumActionNameByAction(action, options));
    },
    [getDtrumActionNameByAction, getGoalParamsByAction],
  );

  const isPortfolioError = useSelector(getIsPortfolioError);

  const debitCmsContent = useContent<ContentCardBlock>(CMS_RESOURCE.tempBlockDebitCard);
  const creditCmsContent = useContent<ContentCreditCardBlock>(CMS_RESOURCE.creditCardNewBlockUnblockCard);

  const formattedDebitCmsContent = debitCmsContent;
  const formattedCreditCmsContent = creditCmsContent ? mapCreditCmsContent(creditCmsContent) : null;

  const content = isDebitProduct ? formattedDebitCmsContent : formattedCreditCmsContent;

  const card = useRouterSelector(getCardEntityByRoute);

  const isComplexBlockFeatureEnabledForCreditCard = useActiveFeature(TEMPORARY_BLOCK_CREDIT_CARD);
  const isComplexBlockFeatureEnabledForDebitCard = useActiveFeature(TEMPORARY_BLOCK_DEBIT_CARD);

  const tempBlockDebitCardAccessMode = useAccessMode(
    HEALTHCHECKS_KEYS.dks_healthcheck,
    COMPONENTS_KEYS.TempBlockDebitCard,
  );
  const complexBlockCreditCardAccessMode = useAccessMode(
    HEALTHCHECKS_KEYS.credCard_healthcheck,
    COMPONENTS_KEYS.blockCardNew,
  );

  const isUnblockActionEnabledForDebitCard = useIsUnblockScenarioEnabled();

  const handleClose = () => {
    history.goBack();
  };

  if (isPortfolioError) {
    return <DefaultErrorBlock />;
  }

  if (!card || isDebitProduct === null || !content) {
    return isDebitProduct ? <ResultScreenSkeleton /> : <CheckScreenSkeleton />;
  }

  const isCard = getIsCardType(card.className);

  const isUnblockEnabled = isDebitProduct
    ? isComplexBlockFeatureEnabledForDebitCard &&
      tempBlockDebitCardAccessMode === ACCESS_MODES.MSA &&
      isUnblockActionEnabledForDebitCard
    : isComplexBlockFeatureEnabledForCreditCard &&
      complexBlockCreditCardAccessMode === ACCESS_MODES.MSA &&
      getIsUnblockEnabledForCreditCard(card as EntityByType<'CreditCard'>);

  if (!isCard || !isUnblockEnabled) {
    return <DefaultErrorBlock />;
  }

  return (
    <UnblockCardView
      card={card}
      content={content}
      onClose={handleClose}
      isConfirmEnabled={!isDebitProduct}
      analyticsCb={handleAnalyticsEvent}
      analyticsMap={analyticsMap}
    />
  );
};

export const UnblockCard = () => (
  <BlockCardScenarioContainer>
    <UnfreezeCardAvailable />
  </BlockCardScenarioContainer>
);
