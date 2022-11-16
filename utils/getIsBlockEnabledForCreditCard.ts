import { SERVICES } from '@modules/CreditCard';

import { CreditCard } from '../types';

export const getIsBlockEnabledForCreditCard = ({ serviceList }: CreditCard) => {
  if (!serviceList) return true;

  const blockCardAction = serviceList.find(({ service }) =>
    [SERVICES.BLOCK_CARD_SCENARIO, SERVICES.BLOCK_CARD_FREEZE_SCENARIO].includes(service),
  );

  return !!blockCardAction;
};
