'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

const GROUPS_RESPONSE = '{"data":[{"id":1503,"alias":"demo","url":"https://lix.li/g/demo","name":"Seller group","is_rotate":false,"description":"Marketing group","created_datetime":"2026-05-21T22:08:37+03:00","deactivated_datetime":null}],"meta":{"total":1,"limit":20,"next_url":null}}';

test('maps Groups DTO and meta correctly', async () => {
  mock.addToResponseChain(200, GROUPS_RESPONSE);

  const result = await client.groups().list();

  expect(result.groups).toHaveLength(1);
  expect(result.groups[0].id).toBe(1503);
  expect(result.groups[0].name).toBe('Seller group');
  expect(result.groups[0].url).toBe('https://lix.li/g/demo');
  expect(result.meta.total).toBe(1);
  expect(result.meta.limit).toBe(20);
  expect(result.meta.nextUrl).toBeNull();
});

test('sends correct GET request for list without pagination', async () => {
  mock.addToResponseChain(200, GROUPS_RESPONSE);

  await client.groups().list();

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/groups');
  expect(requests[0].method).toBe('GET');
  expect(requests[0].body).toBeNull();
});

test('sends correct GET request with pagination params', async () => {
  mock.addToResponseChain(200, GROUPS_RESPONSE);

  await client.groups().list(10, 1000);

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/groups?limit=10&from_id=1000');
});
