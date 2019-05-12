import ProcessingRequest from './processing-request';

describe('ProcessingRequest', () => {
  const processingRequest = new ProcessingRequest(
    {
      key: 'AIzaSyAc8TqMl112AqFC6u7Nd5vGuwwCtE-o2Vg',
      maxResults: 15,
    }
  );

  it('ProcessingRequest.getViewCount should return an array with the number of views',  () => {
    const listId = ['nq4aU9gmZQk', 'REu2BcnlD34', 'qbPTdW7KgOg'];
    const result = processingRequest.getViewCount(listId);
    const arrViewCount = [2149612,5680416,268174];

    result.then((res) => {
      expect(res).toEqual(arrViewCount);
    });
  });

  it('ProcessingRequest.textLastRequset should return last request text',  () => {
    const textRequest = 'test 1';
    processingRequest.createRequest(textRequest);

    expect(processingRequest.textLastRequset).toBe(textRequest);
  });

  it('ProcessingRequest.fullUrlSearch should return full url search',  () => {
    const textRequest = 'request 1';
    processingRequest.createRequest(textRequest);

    expect(processingRequest.fullUrlSearch).toBe(`${processingRequest.urlSearch}&q=${textRequest}`);
  });
});

