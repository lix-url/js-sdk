'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

test('sends correct DELETE request when deleting a link', async () => {
  mock.addToResponseChain(200, '{}');

  await client.links().delete(123);

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/links/123');
  expect(requests[0].method).toBe('DELETE');
  expect(requests[0].body).toBeNull();
  expect(requests[0].headers['X-Api-Key']).toBe('lix_test_some_key1');
  expect(requests[0].headers['User-Agent']).toBe('lix-js-sdk/0.1.0');
});

test('delete resolves without returning a value', async () => {
  mock.addToResponseChain(200, '{}');

  const result = await client.links().delete(123);

  expect(result).toBeUndefined();
});
