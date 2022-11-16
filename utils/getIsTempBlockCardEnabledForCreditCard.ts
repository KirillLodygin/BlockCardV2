import { SERVICES } from '@modules/CreditCard';

import { CreditCard } from '../types';

export const getIsTempBlockCardEnabledForCreditCard = ({ serviceList }: CreditCard) => {
  if (!serviceList) return true;

  const tempBlockCardAction = serviceList.find(({ service }) => SERVICES.BLOCK_CARD_FREEZE_SCENARIO === service);

  return !!tempBlockCardAction;
};
