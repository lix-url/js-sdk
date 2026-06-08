'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

const LINKS_RESPONSE = '{"data":[{"id":79618,"alias":"a2Ag4","short_url":"https://lix.li/a2Ag4","url":"https://example.com","is_public":true,"title":"Promo","created_datetime":"2026-05-21T23:35:02+03:00","active_before_datetime":"2029-05-21T21:25:40+03:00","deleted_datetime":null,"group":{"id":1005,"alias":"2222","url":"https://lix.li/g/2222","name":"Test","is_rotate":false,"description":"df","created_datetime":"2026-05-18T01:55:50+03:00","deactivated_datetime":null},"tags":["promo","sale"],"meta":{"title":"Promo"}},{"id":79615,"alias":"oSCZ0mP","short_url":"https://lix.li/oSCZ0mP","url":"https://console.cloud.google.com","is_public":true,"title":null,"created_datetime":"2026-05-18T03:31:12+03:00","active_before_datetime":null,"deleted_datetime":null,"group":null,"tags":[],"meta":{}}],"meta":{"total":5,"limit":2,"next_url":"https://lix.li/api/1.0/links?from_id=79615&limit=2"}}';

test('maps Links DTO and meta correctly', async () => {
  mock.addToResponseChain(200, LINKS_RESPONSE);

  const result = await client.links().list();

  expect(result.links).toHaveLength(2);
  expect(result.links[0].shortUrl).toBe('https://lix.li/a2Ag4');
  expect(result.links[1].shortUrl).toBe('https://lix.li/oSCZ0mP');
  expect(result.links[0].group).not.toBeNull();
  expect(result.links[1].group).toBeNull();
  expect(result.meta.total).toBe(5);
  expect(result.meta.limit).toBe(2);
  expect(result.meta.nextUrl).toBe('https://lix.li/api/1.0/links?from_id=79615&limit=2');
});

test('sends correct GET request for list without pagination', async () => {
  mock.addToResponseChain(200, LINKS_RESPONSE);

  await client.links().list();

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/links');
  expect(requests[0].method).toBe('GET');
  expect(requests[0].body).toBeNull();
});

test('sends correct GET request with pagination params', async () => {
  mock.addToResponseChain(200, LINKS_RESPONSE);

  await client.links().list(100, 500);

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/links?limit=100&from_id=500');
});
