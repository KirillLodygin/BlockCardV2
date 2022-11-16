import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { ACCESS_MODES, COMPONENTS_KEYS, HEALTHCHECKS_KEYS, useAccessMode } from '@common/coreSettings';
import { TEMPORARY_BLOCK_CREDIT_CARD, TEMPORARY_BLOCK_DEBIT_CARD, useActiveFeature } from '@common/featureFlags';
import {
  useRouterSelector,
  getCardEntityByRoute,
  getIsCardType,
  useRefetchArchivalProducts,
  EntityByType,
} from '@modules/DebitAndCreditCards';
import { useIsDebitProductByRoute } from '@modules/DebitProducts';
import { getIsPortfolioError } from '@modules/Portfolios';
import { BlockCard } from '@modules/ProductDetails';

import { BlockCardLayoutSkeleton } from '../components/BlockCardLayoutSkeleton';
import { DefaultErrorBlock } from '../components/components';
import { useIsBlockScenarioEnabled, useIsTempBlockScenarioEnabled } from '../hooks/useIsScenarioEnabled';
import { getIsBlockEnabledForCreditCard } from '../utils/getIsBlockEnabledForCreditCard';
import { getIsTempBlockCardEnabledForCreditCard } from '../utils/getIsTempBlockCardEnabledForCreditCard';
import { BlockCard as BlockCardV2 } from './BlockCard';
import { BlockCardScenarioContainer } from './BlockCardScenarioContainer';

export const BlockCardPage = () => {
  useRefetchArchivalProducts();

  const history = useHistory();

  const card = useRouterSelector(getCardEntityByRoute);
  const isDebitProduct = useIsDebitProductByRoute();

  const isPortfolioError = useSelector(getIsPortfolioError);

  const isComplexBlockFeatureEnabledForCreditCard = useActiveFeature(TEMPORARY_BLOCK_CREDIT_CARD);
  const isComplexBlockFeatureEnabledForDebitCard = useActiveFeature(TEMPORARY_BLOCK_DEBIT_CARD);
  const complexBlockAccessModeForCreditCard = useAccessMode(
    HEALTHCHECKS_KEYS.credCard_healthcheck,
    COMPONENTS_KEYS.blockCardNew,
  );
  const blockAccessModeForDebitCard = useAccessMode(HEALTHCHECKS_KEYS.dks_healthcheck, COMPONENTS_KEYS.BlockDebitCard);
  const tempBlockAccessModeForDebitCard = useAccessMode(
    HEALTHCHECKS_KEYS.dks_healthcheck,
    COMPONENTS_KEYS.TempBlockDebitCard,
  );

  const isBlockEnabledForDebitCard = useIsBlockScenarioEnabled();
  const isTempBlockActionEnabledForDebitCard = useIsTempBlockScenarioEnabled();

  if (isPortfolioError) {
    return (
      <BlockCardScenarioContainer>
        <DefaultErrorBlock />
      </BlockCardScenarioContainer>
    );
  }

  if (!card || isDebitProduct === null) {
    return (
      <BlockCardScenarioContainer>
        <BlockCardLayoutSkeleton />
      </BlockCardScenarioContainer>
    );
  }

  const isCard = getIsCardType(card.className);

  if (!isCard) {
    return (
      <BlockCardScenarioContainer>
        <DefaultErrorBlock />
      </BlockCardScenarioContainer>
    );
  }

  const isComplexBlockFeatureEnabled = isDebitProduct
    ? isComplexBlockFeatureEnabledForDebitCard && blockAccessModeForDebitCard === ACCESS_MODES.MSA
    : isComplexBlockFeatureEnabledForCreditCard && complexBlockAccessModeForCreditCard === ACCESS_MODES.MSA;

  if (!isComplexBlockFeatureEnabled) {
    return <BlockCard />;
  }

  const isBlockEnabled = isDebitProduct
    ? isBlockEnabledForDebitCard
    : getIsBlockEnabledForCreditCard(card as EntityByType<'CreditCard'>);

  if (!isBlockEnabled) {
    return (
      <BlockCardScenarioContainer>
        <DefaultErrorBlock />
      </BlockCardScenarioContainer>
    );
  }

  const isTempBlockEnabledForDebitCard =
    tempBlockAccessModeForDebitCard === ACCESS_MODES.MSA && isTempBlockActionEnabledForDebitCard;
  const isTempBlockCardEnabled = isDebitProduct
    ? isTempBlockEnabledForDebitCard
    : getIsTempBlockCardEnabledForCreditCard(card as EntityByType<'CreditCard'>);

  const handleClose = () => {
    history.goBack();
  };

  const handleClickIssueCard = () => {
    history.replace('/products/cardsAndAccounts');
  };

  return (
    <BlockCardScenarioContainer>
      <BlockCardV2
        card={card}
        isDebitProduct={isDebitProduct}
        isTempBlockCardScenarioAvailable={isTempBlockCardEnabled}
        onClose={handleClose}
        onClickIssueCard={handleClickIssueCard}
      />
    </BlockCardScenarioContainer>
  );
};
