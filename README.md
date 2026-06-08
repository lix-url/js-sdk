# Lix.li JavaScript SDK

Official JavaScript SDK for the [Lix.li](https://lix.li) URL shortening and link analytics API.

## Requirements

- Node.js 14+

## Installation

```bash
npm install @lix-url/sdk
```

## Quick Start

```js
const { Client } = require('@lix-url/sdk');

const client = new Client('your_api_key');

const result = await client.links().create('https://example.com');
console.log(result.link.shortUrl); // https://lix.li/xxxxx
```

---

## Links

### Create a short link

```js
const result = await client.links().create('https://example.com');
console.log(result.link.shortUrl);
console.log(result.usage.remaining);
```

### Create a link with a custom alias

```js
const result = await client.links().create(
  'https://example.com',
  'my-link', // alias
);
console.log(result.link.shortUrl); // https://lix.li/my-link
```

### Create a link with all options

```js
const result = await client.links().create(
  'https://example.com',                // url
  'my-alias',                           // alias
  'My Page Title',                      // title
  42,                                   // groupId
  ['sale', 'promo'],                    // tags
  { title: 'Sale!', description: '...' }, // meta
  { utm_source: 'google', utm_medium: 'email', utm_campaign: 'summer' }, // utm
  [1001, 1002],                         // trackingPixelIds
  '2029-12-31T23:59:59+00:00',         // activeBeforeDatetime
  'secret123',                          // password
  true,                                 // isPublic
);
```

### Update a link

```js
const result = await client.links().update(
  79697,              // id
  null,               // url (unchanged)
  'New Title',        // title
);
console.log(result.link.title);
```

### Get a link by ID

```js
const link = await client.links().get(79697);
console.log(link.shortUrl);
console.log(link.url);
console.log(link.group?.name);
```

### List links

```js
const response = await client.links().list();
// With pagination:
const page = await client.links().list(20, 79500); // limit, fromId

for (const link of response.links) {
  console.log(link.shortUrl, link.url);
}
console.log(response.meta.total);
console.log(response.meta.nextUrl);
```

### Delete a link

```js
await client.links().delete(79697);
```

---

## Groups

### Create a group

```js
const group = await client.groups().create('Marketing');
// With options:
const group2 = await client.groups().create(
  'Landing Pages',
  'Rotating landing pages', // description
  true,                     // isRotate
);
```

### Update a group

```js
const group = await client.groups().update(
  10,                      // groupId
  null,                    // name (unchanged)
  'Updated description',   // description
  false,                   // isRotate
);
```

### Get a group by ID

```js
const group = await client.groups().get(10);
console.log(group.name);
console.log(group.alias);
console.log(group.url);
```

### List groups

```js
const response = await client.groups().list();
// With pagination:
const page = await client.groups().list(10, 1000); // limit, fromId

for (const group of response.groups) {
  console.log(group.name);
}
console.log(response.meta.total);
```

### Delete a group

```js
await client.groups().delete(10);
```

---

## Profile

```js
const profile = await client.profile().me();

console.log(profile.client.name);
console.log(profile.user.email);
console.log(profile.plan.name);
console.log(profile.usages.apiLinks.remaining);
console.log(profile.usages.links.used);
console.log(profile.usages.massLinks.limit);
```

---

## Error Handling

```js
const {
  ValidationException,
  UnauthorizedException,
  NotFoundException,
  RateLimitException,
  ServerException,
} = require('@lix-url/sdk');

try {
  const result = await client.links().create('https://example.com');
} catch (e) {
  if (e instanceof ValidationException) {
    console.error('Validation errors:', e.data);
  } else if (e instanceof UnauthorizedException) {
    console.error('Invalid API key');
  } else if (e instanceof NotFoundException) {
    console.error('Resource not found');
  } else if (e instanceof RateLimitException) {
    console.error('Rate limit exceeded');
  } else if (e instanceof ServerException) {
    console.error('Server error');
  } else {
    throw e;
  }
}
```

---

## Meta Fields

Use the `MetaEnum` constants when building meta objects:

```js
const { MetaEnum } = require('@lix-url/sdk');

const meta = {
  [MetaEnum.META_TITLE]: 'Page Title',
  [MetaEnum.META_OG_TITLE]: 'OG Title',
  [MetaEnum.META_DESCRIPTION]: 'Description',
  [MetaEnum.META_OG_DESCRIPTION]: 'OG Description',
  [MetaEnum.META_OG_IMAGE]: 'https://example.com/image.png',
  [MetaEnum.META_KEYWORDS]: 'sale, promo',
};
```

---

## Running Tests

```bash
npm install
npm test
```

## Project Structure

```
src/
  Client.js              — main entry point
  http/
    ApiClient.js         — fetch-based HTTP wrapper
  resources/
    Links.js             — links resource
    Groups.js            — groups resource
    Profile.js           — profile resource
  dto/
    index.js             — all Data Transfer Object classes
  exceptions/
    index.js             — typed exception classes
tests/                   — Jest test suite
```
