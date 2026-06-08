'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

const GET_LINK_RESPONSE = '{"data":{"id":79697,"alias":"demo2","short_url":"https://lix.li/demo2","url":"https://example.com","is_public":true,"title":null,"created_datetime":"2026-05-27T22:16:22+03:00","active_before_datetime":null,"deleted_datetime":null,"group":null,"tags":["sale","promo"],"meta":[]}}';

test('maps Link DTO correctly on get', async () => {
  mock.addToResponseChain(200, GET_LINK_RESPONSE);

  const link = await client.links().get(79697);

  expect(link.id).toBe(79697);
  expect(link.alias).toBe('demo2');
  expect(link.shortUrl).toBe('https://lix.li/demo2');
  expect(link.url).toBe('https://example.com');
  expect(link.isPublic).toBe(true);
  expect(link.group).toBeNull();
  expect(link.tags).toEqual(['sale', 'promo']);
});

test('sends correct GET request for a single link', async () => {
  mock.addToResponseChain(200, GET_LINK_RESPONSE);

  await client.links().get(123);

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/links/123');
  expect(requests[0].method).toBe('GET');
  expect(requests[0].body).toBeNull();
  expect(requests[0].headers['X-Api-Key']).toBe('lix_test_some_key1');
  expect(requests[0].headers['User-Agent']).toBe('lix-js-sdk/0.1.0');
});
