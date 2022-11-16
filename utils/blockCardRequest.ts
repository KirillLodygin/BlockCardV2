import { ajaxMsa, PRIVATE_GATEWAY_URL } from '@common/ajax';

import { BlockCardReqeustDataType } from '../types';

export const blockCardRequest = async (url: string, data?: BlockCardReqeustDataType) => {
  const response = await ajaxMsa.request({
    url: `${PRIVATE_GATEWAY_URL}/credcards/cc-lock/${url}`,
    method: 'POST',
    data,
  });

  return response;
};
