import { ajaxMsa } from '@common/ajax';

import { blockCardRequest } from './blockCardRequest';

const mockUrl = 'baz';
const mockData = {
  secureCode: 'bar',
  transactionId: 'quux',
};
const mockResponse = {
  qux: 'qux',
};

jest.mock('@common/ajax', () => ({
  ajaxMsa: {
    request: jest.fn(),
  },
  PRIVATE_GATEWAY_URL: 'foo',
}));

describe('blockCardRequest', () => {
  beforeEach(() => {
    (ajaxMsa.request as jest.Mock).mockReset();
    (ajaxMsa.request as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('calls request with all params', async () => {
    const response = await blockCardRequest(mockUrl, mockData);

    expect(response).toEqual(mockResponse);
    expect(ajaxMsa.request).toHaveBeenCalledTimes(1);
    expect(ajaxMsa.request).toHaveBeenCalledWith({
      data: mockData,
      method: 'POST',
      url: `foo/credcards/cc-lock/${mockUrl}`,
    });
  });

  it('calls request with required params', async () => {
    const response = await blockCardRequest(mockUrl);

    expect(response).toEqual(mockResponse);
    expect(ajaxMsa.request).toHaveBeenCalledTimes(1);
    expect(ajaxMsa.request).toHaveBeenCalledWith({
      method: 'POST',
      url: `foo/credcards/cc-lock/${mockUrl}`,
    });
  });
});
