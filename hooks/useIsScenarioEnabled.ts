import isEmpty from 'lodash/isEmpty';
import { useSelector } from 'react-redux';

import { OPERATIONS_CONSTANTS } from '@common/overmind/helpers/customScenarioTools';
import { State } from '@common/redux/types';
import { getProductServices } from '@common/serviceList';
import { useRouterSelector } from '@modules/DebitAndCreditCards';
import {
  getDebitProductRawActionsByRoute,
  useAllActionsMsa,
  useDebitProductDetailsPageParams,
  MSA_DEBIT_PRODUCT_ACTION_TYPE_DICTIONARY,
} from '@modules/DebitProductDetails';
import { useComputedParams } from '@modules/ProductDetails';

const TEMP_BLOCK_RAW_ACTION_ID = 'freeze';

// TODO-gordeev переделать? перенести утилиты? норм что испортируем из DebitProductDetails?

export const useIsBlockScenarioEnabledForMsa = (): boolean => {
  // TODO-gordeev вынести хуки в отдельный модуль?
  const actions = useAllActionsMsa();

  if (!actions) return true;

  const blockCardAction = actions.find(({ id }) => id === MSA_DEBIT_PRODUCT_ACTION_TYPE_DICTIONARY.blockCard);
  const permanentBlockCardAction = actions.find(
    ({ id }) => id === MSA_DEBIT_PRODUCT_ACTION_TYPE_DICTIONARY.permanentBlockCard,
  );

  return !!blockCardAction || !!permanentBlockCardAction;
};

export const useIsBlockScenarioEnabledForMinerva = (): boolean => {
  const computedParams = useComputedParams();
  const productServices = useSelector((state: State) => getProductServices(state, computedParams));

  if (isEmpty(productServices)) {
    return true;
  }

  const item = productServices[OPERATIONS_CONSTANTS.operationTypes.BLOCK_CARD];

  if (!item) {
    return false;
  }

  return item.enabled;
};

export const useIsBlockScenarioEnabled = () => {
  const pageParams = useDebitProductDetailsPageParams();

  const isEnabledForMsa = useIsBlockScenarioEnabledForMsa();
  const isEnabledForMinerva = useIsBlockScenarioEnabledForMinerva();

  if (!pageParams) return true;

  const { isEnabled, isMsa } = pageParams;

  if (!isEnabled) return true;

  return isMsa ? isEnabledForMsa : isEnabledForMinerva;
};

export const useIsTempBlockScenarioEnabled = (): boolean => {
  const rawActionDictionary = useRouterSelector(getDebitProductRawActionsByRoute);

  if (!rawActionDictionary) return true;

  const tempBlockCardRawAction = rawActionDictionary[TEMP_BLOCK_RAW_ACTION_ID];

  if (!tempBlockCardRawAction) return false;

  return tempBlockCardRawAction.enabled;
};

export const useIsUnblockScenarioEnabled = (): boolean => {
  // TODO-gordeev вынести хуки в отдельный модуль?
  const actions = useAllActionsMsa();

  if (!actions) return true;

  const unblockCardAction = actions.find(({ id }) => id === MSA_DEBIT_PRODUCT_ACTION_TYPE_DICTIONARY.unblockCard);

  return !!unblockCardAction;
};
