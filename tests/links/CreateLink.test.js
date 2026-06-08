'use strict';

const { Client } = require('../../src/Client.js');
const { MockHttpClient } = require('../MockHttpClient.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_123', mock.fetch);
});

const CREATE_RESPONSE_WITH_GROUP = '{"data":{"id":79697,"alias":"demo","short_url":"https://lix.li/demo","url":"https://example.com/very/long/page","is_public":true,"title":"Some Title","created_datetime":"2026-05-27T22:16:22+03:00","active_before_datetime":null,"deleted_datetime":null,"group":{"id":1503,"alias":"demo","url":"https://lix.li/g/demo","name":"Seller group","is_rotate":false,"description":"Marketing group","created_datetime":"2026-05-21T22:08:37+03:00","deactivated_datetime":null},"tags":["sale","promo"],"meta":{"title":"Awesome sale!","og:title":"Awesome sale!!!!","description":"Woooooo, its wonderful!","og:description":"Woooowww, its wonderful!","keywords":"sale, promo"}},"usage":{"limit":500,"used":3,"remaining":497}}';

test('maps LinkShortenResult and nested DTOs correctly', async () => {
  mock.addToResponseChain(201, CREATE_RESPONSE_WITH_GROUP);

  const result = await client.links().create('https://example.com/very/long/page');
  const link = result.link;

  expect(link.id).toBe(79697);
  expect(link.title).toBe('Some Title');
  expect(link.alias).toBe('demo');
  expect(link.shortUrl).toBe('https://lix.li/demo');
  expect(link.url).toBe('https://example.com/very/long/page');
  expect(link.isPublic).toBe(true);
  expect(link.activeBeforeDatetime).toBeNull();
  expect(link.deletedDatetime).toBeNull();
  expect(link.createdDatetime).toBe('2026-05-27T22:16:22+03:00');
  expect(link.tags).toEqual(['sale', 'promo']);
  expect(link.meta).toEqual({
    title: 'Awesome sale!',
    'og:title': 'Awesome sale!!!!',
    description: 'Woooooo, its wonderful!',
    'og:description': 'Woooowww, its wonderful!',
    keywords: 'sale, promo',
  });

  const group = link.group;
  expect(group.id).toBe(1503);
  expect(group.alias).toBe('demo');
  expect(group.url).toBe('https://lix.li/g/demo');
  expect(group.isRotate).toBe(false);
  expect(group.deactivatedDatetime).toBeNull();
  expect(group.createdDatetime).toBe('2026-05-21T22:08:37+03:00');

  expect(result.usage.limit).toBe(500);
  expect(result.usage.used).toBe(3);
  expect(result.usage.remaining).toBe(497);
});

test('handles link with null group', async () => {
  mock.addToResponseChain(201, '{"data":{"id":79697,"alias":"demo2","short_url":"https://lix.li/demo2","url":"https://example.com","is_public":true,"title":null,"created_datetime":"2026-05-27T22:16:22+03:00","active_before_datetime":null,"deleted_datetime":null,"group":null,"tags":[],"meta":[]},"usage":{"limit":500,"used":3,"remaining":497}}');

  const result = await client.links().create('https://example.com');

  expect(result.link.group).toBeNull();
  expect(result.link.title).toBeNull();
});

test('sends correct POST request with all parameters', async () => {
  mock.addToResponseChain(201, '{"data":{"id":79697,"alias":"demo2","short_url":"https://lix.li/demo2","url":"https://example.com/very/long/page","is_public":true,"title":null,"created_datetime":"2026-05-27T22:16:22+03:00","active_before_datetime":null,"deleted_datetime":null,"group":null,"tags":[],"meta":[]},"usage":{"limit":500,"used":3,"remaining":497}}');

  const client2 = new Client('lix_test_some_key1', mock.fetch);
  await client2.links().create(
    'https://example.com/very/long/page',
    'demo',
    'Some Title',
    1000,
    ['sale', 'promo'],
    { title: 'Awesome sale!', 'og:title': 'Awesome sale!!!!', description: 'Woooooo, its wonderful!', 'og:description': 'Woooowww, its wonderful!', keywords: 'sale, promp' },
    { utm_source: 'google ads', utm_medium: 'email', utm_campaign: 'sale', utm_content: 'buy', utm_term: 'banner' },
    [1110, 1023],
    '2029-05-21T21:25:40+03:00',
    '12345',
    true,
  );

  const requests = mock.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe('https://lix.li/api/1.0/links');
  expect(requests[0].body).toBe('{"group_id":1000,"url":"https://example.com/very/long/page","alias":"demo","password":"12345","title":"Some Title","tags":["sale","promo"],"is_public":true,"tracking_pixel_ids":[1110,1023],"meta":{"title":"Awesome sale!","og:title":"Awesome sale!!!!","description":"Woooooo, its wonderful!","og:description":"Woooowww, its wonderful!","keywords":"sale, promp"},"utm":{"utm_source":"google ads","utm_medium":"email","utm_campaign":"sale","utm_content":"buy","utm_term":"banner"},"active_before_datetime":"2029-05-21T21:25:40+03:00"}');
  expect(requests[0].method).toBe('POST');
  expect(requests[0].headers['X-Api-Key']).toBe('lix_test_some_key1');
  expect(requests[0].headers['User-Agent']).toBe('lix-js-sdk/0.1.0');
});
