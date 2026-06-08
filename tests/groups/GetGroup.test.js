'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

test('maps Group DTO fields correctly on get', async () => {
  mock.addToResponseChain(200, '{"data":{"id":10,"alias":"demo","url":"https://lix.li/g/demo","name":"Seller group","is_rotate":false,"description":"Marketing group","created_datetime":"2026-05-21T22:08:37+03:00","deactivated_datetime":null}}');

  const group = await client.groups().get(10);

  expect(group.id).toBe(10);
  expect(group.name).toBe('Seller group');
  expect(group.description).toBe('Marketing group');
  expect(group.alias).toBe('demo');
  expect(group.url).toBe('https://lix.li/g/demo');
  expect(group.isRotate).toBe(false);
  expect(group.deactivatedDatetime).toBeNull();
  expect(group.createdDatetime).toBe('2026-05-21T22:08:37+03:00');
});

test('sends correct GET request for a single group', async () => {
  mock.addToResponseChain(200, '{"data":{"id":10,"alias":"demo","url":"https://lix.li/g/demo","name":"Seller group","is_rotate":false,"description":"Marketing group","created_datetime":"2026-05-21T22:08:37+03:00","deactivated_datetime":null}}');

  await client.groups().get(10);

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/groups/10');
  expect(requests[0].method).toBe('GET');
  expect(requests[0].body).toBeNull();
  expect(requests[0].headers['X-Api-Key']).toBe('lix_test_some_key1');
  expect(requests[0].headers['User-Agent']).toBe('lix-js-sdk/0.1.0');
});
