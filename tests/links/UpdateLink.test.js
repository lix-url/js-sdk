'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

const UPDATE_RESPONSE = '{"data":{"id":79697,"alias":"demo2","short_url":"https://lix.li/demo2","url":"https://example.com","is_public":true,"title":"Updated title","created_datetime":"2026-05-27T22:16:22+03:00","active_before_datetime":null,"deleted_datetime":null,"group":null,"tags":[],"meta":[]},"usage":{"limit":500,"used":3,"remaining":497}}';

test('maps LinkShortenResult correctly after update', async () => {
  mock.addToResponseChain(200, UPDATE_RESPONSE);

  const result = await client.links().update(123, null, 'Updated title');

  expect(result.link.id).toBe(79697);
  expect(result.link.title).toBe('Updated title');
  expect(result.link.shortUrl).toBe('https://lix.li/demo2');
  expect(result.usage.limit).toBe(500);
  expect(result.usage.used).toBe(3);
  expect(result.usage.remaining).toBe(497);
});

test('sends correct PATCH request when updating a link', async () => {
  mock.addToResponseChain(200, UPDATE_RESPONSE);

  await client.links().update(123, null, 'Updated title');

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/links/123');
  expect(requests[0].body).toBe('{"group_id":null,"url":null,"password":null,"title":"Updated title","tags":[],"is_public":true,"tracking_pixel_ids":[],"meta":[],"utm":[],"active_before_datetime":null}');
  expect(requests[0].method).toBe('PATCH');
  expect(requests[0].headers['X-Api-Key']).toBe('lix_test_some_key1');
  expect(requests[0].headers['User-Agent']).toBe('lix-js-sdk/0.1.0');
});
