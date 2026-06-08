'use strict';

const { HttpClientException } = require('../src/exceptions/index.js');

class MockHttpClient {
  constructor() {
    this._requests = [];
    this._responses = [];
    this._chainInited = false;
  }

  get fetch() {
    return async (url, options = {}) => {
      this._requests.push({
        url,
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body !== undefined ? options.body : null,
      });

      if (this._chainInited && this._responses.length === 0) {
        throw new HttpClientException('No responses in the chain');
      }

      return this._chainInited
        ? this._responses.shift()
        : this._makeResponse(200, '');
    };
  }

  addToResponseChain(status, body = '') {
    this._chainInited = true;
    this._responses.push(this._makeResponse(status, body));
    return this;
  }

  getRequests() {
    return this._requests;
  }

  clear() {
    this._requests = [];
    this._responses = [];
    this._chainInited = false;
    return this;
  }

  _makeResponse(status, body) {
    return {
      status,
      text: async () => body,
    };
  }
}

module.exports = { MockHttpClient };
