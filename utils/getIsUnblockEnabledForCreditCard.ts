import { SERVICES } from '@modules/CreditCard';

import { CreditCard } from '../types';

export const getIsUnblockEnabledForCreditCard = ({ serviceList }: CreditCard) => {
  if (!serviceList) return true;

  const unblockCardAction = serviceList.find(({ service }) => SERVICES.UNBLOCK_CARD_FREEZE_SCENARIO === service);

  return !!unblockCardAction;
};
