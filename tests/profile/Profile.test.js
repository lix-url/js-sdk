'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

const PROFILE_RESPONSE = '{"client":{"id":1022,"name":"Test Client","email":"test@lix.li","created_datetime":"2022-04-24T17:38:42+03:00"},"user":{"name":"John Doe","email":"test_user@lix.li","created_datetime":"2023-04-14T17:38:42+03:00"},"plan":{"id":2,"name":"Pro","start_datetime":"2026-05-09T13:12:46+03:00","end_datetime":"2027-05-09T13:12:46+03:00"},"usage":{"links":{"limit":null,"used":1,"remaining":null},"api_links":{"limit":500,"used":100,"remaining":400},"mass_links":{"limit":100,"used":10,"remaining":90}}}';

test('maps Profile DTO with all nested objects correctly', async () => {
  mock.addToResponseChain(200, PROFILE_RESPONSE);

  const profile = await client.profile().me();

  expect(profile.client.id).toBe(1022);
  expect(profile.client.name).toBe('Test Client');
  expect(profile.client.email).toBe('test@lix.li');
  expect(profile.client.createdDatetime).toBe('2022-04-24T17:38:42+03:00');

  expect(profile.user.name).toBe('John Doe');
  expect(profile.user.email).toBe('test_user@lix.li');
  expect(profile.user.createdDatetime).toBe('2023-04-14T17:38:42+03:00');

  expect(profile.plan.id).toBe(2);
  expect(profile.plan.name).toBe('Pro');
  expect(profile.plan.startDatetime).toBe('2026-05-09T13:12:46+03:00');
  expect(profile.plan.endDatetime).toBe('2027-05-09T13:12:46+03:00');

  expect(profile.usages.links.limit).toBeNull();
  expect(profile.usages.links.used).toBe(1);
  expect(profile.usages.links.remaining).toBeNull();

  expect(profile.usages.apiLinks.limit).toBe(500);
  expect(profile.usages.apiLinks.used).toBe(100);
  expect(profile.usages.apiLinks.remaining).toBe(400);

  expect(profile.usages.massLinks.limit).toBe(100);
  expect(profile.usages.massLinks.used).toBe(10);
  expect(profile.usages.massLinks.remaining).toBe(90);
});

test('sends correct GET request for profile me', async () => {
  mock.addToResponseChain(200, PROFILE_RESPONSE);

  await client.profile().me();

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/me');
  expect(requests[0].method).toBe('GET');
  expect(requests[0].body).toBeNull();
  expect(requests[0].headers['X-Api-Key']).toBe('lix_test_some_key1');
  expect(requests[0].headers['User-Agent']).toBe('lix-js-sdk/0.1.0');
});
