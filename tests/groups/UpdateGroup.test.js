'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

test('maps Group DTO correctly after update', async () => {
  mock.addToResponseChain(200, '{"data":{"id":1503,"alias":"demo","url":"https://lix.li/g/demo","name":"Seller group","is_rotate":false,"description":"Updated description","created_datetime":"2026-05-21T22:08:37+03:00","deactivated_datetime":null}}');

  const group = await client.groups().update(10, null, 'Updated description', false);

  expect(group.id).toBe(1503);
  expect(group.name).toBe('Seller group');
  expect(group.description).toBe('Updated description');
});

test('sends correct PATCH request when updating a group', async () => {
  mock.addToResponseChain(200, '{"data":{"id":1503,"alias":"demo","url":"https://lix.li/g/demo","name":"Seller group","is_rotate":false,"description":"Updated description","created_datetime":"2026-05-21T22:08:37+03:00","deactivated_datetime":null}}');

  await client.groups().update(10, null, 'Updated description', false);

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/groups/10');
  expect(requests[0].body).toBe('{"name":null,"description":"Updated description","is_rotate":false}');
  expect(requests[0].method).toBe('PATCH');
  expect(requests[0].headers['X-Api-Key']).toBe('lix_test_some_key1');
  expect(requests[0].headers['User-Agent']).toBe('lix-js-sdk/0.1.0');
});
