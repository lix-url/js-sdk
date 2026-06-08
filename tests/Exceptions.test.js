'use strict';

const { Client } = require('../src/Client.js');
const { MockHttpClient } = require('./MockHttpClient.js');
const {
  UnauthorizedException,
  NotFoundException,
  RateLimitException,
  ServerException,
  ValidationException,
} = require('../src/exceptions/index.js');

let mock;
let client;

beforeEach(() => {
  mock = new MockHttpClient();
  client = new Client('lix_test_some_key1', mock.fetch);
});

test('throws ValidationException with error data on 400', async () => {
  mock.addToResponseChain(400, '{"error":"invalid_parameters","parameter_errors":{"name":{"code":"required","message":"field required"}},"error_message":null}');

  await expect(client.groups().create('test')).rejects.toThrow(ValidationException);

  mock.clear();
  mock.addToResponseChain(400, '{"error":"invalid_parameters","parameter_errors":{"name":{"code":"required","message":"field required"}},"error_message":null}');

  try {
    await client.groups().create('test');
  } catch (e) {
    expect(e).toBeInstanceOf(ValidationException);
    expect(e.data).toEqual({ name: { code: 'required', message: 'field required' } });
  }
});

const errorCases = [
  [401, 'groups', 'get', [1], UnauthorizedException],
  [404, 'groups', 'get', [1], NotFoundException],
  [429, 'groups', 'get', [1], RateLimitException],
  [500, 'groups', 'get', [1], ServerException],

  [401, 'groups', 'list', [], UnauthorizedException],
  [404, 'groups', 'list', [], NotFoundException],
  [429, 'groups', 'list', [], RateLimitException],
  [500, 'groups', 'list', [], ServerException],

  [401, 'groups', 'delete', [1], UnauthorizedException],
  [404, 'groups', 'delete', [1], NotFoundException],
  [429, 'groups', 'delete', [1], RateLimitException],
  [500, 'groups', 'delete', [1], ServerException],

  [401, 'groups', 'create', ['test'], UnauthorizedException],
  [404, 'groups', 'create', ['test'], NotFoundException],
  [429, 'groups', 'create', ['test'], RateLimitException],
  [500, 'groups', 'create', ['test'], ServerException],

  [401, 'groups', 'update', [1], UnauthorizedException],
  [404, 'groups', 'update', [1], NotFoundException],
  [429, 'groups', 'update', [1], RateLimitException],
  [500, 'groups', 'update', [1], ServerException],

  [401, 'links', 'get', [1], UnauthorizedException],
  [404, 'links', 'get', [1], NotFoundException],
  [429, 'links', 'get', [1], RateLimitException],
  [500, 'links', 'get', [1], ServerException],

  [401, 'links', 'list', [], UnauthorizedException],
  [404, 'links', 'list', [], NotFoundException],
  [429, 'links', 'list', [], RateLimitException],
  [500, 'links', 'list', [], ServerException],

  [401, 'links', 'delete', [1], UnauthorizedException],
  [404, 'links', 'delete', [1], NotFoundException],
  [429, 'links', 'delete', [1], RateLimitException],
  [500, 'links', 'delete', [1], ServerException],

  [401, 'links', 'create', ['https://example.com'], UnauthorizedException],
  [404, 'links', 'create', ['https://example.com'], NotFoundException],
  [429, 'links', 'create', ['https://example.com'], RateLimitException],
  [500, 'links', 'create', ['https://example.com'], ServerException],

  [401, 'links', 'update', [1], UnauthorizedException],
  [404, 'links', 'update', [1], NotFoundException],
  [429, 'links', 'update', [1], RateLimitException],
  [500, 'links', 'update', [1], ServerException],
];

test.each(errorCases)(
  'HTTP %i on %s.%s throws correct exception',
  async (httpCode, resource, method, args, ExceptionClass) => {
    mock.clear();
    mock.addToResponseChain(httpCode, '');
    await expect(client[resource]()[method](...args)).rejects.toThrow(ExceptionClass);
  },
);
