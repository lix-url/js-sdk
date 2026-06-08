'use strict';

const nodeFetch = require('node-fetch');

const {
        NotFoundException,
        RateLimitException,
        ServerException,
        UnauthorizedException,
        ValidationException,
      } = require('../exceptions/index.js');

const API_URL = 'https://lix.li/api/1.0';
const USER_AGENT = 'lix-js-sdk/0.1.0';

class ApiClient {
  constructor(apiKey, fetchFn) {
    this.apiKey = apiKey;
    this.fetchFn = fetchFn || nodeFetch;
  }

  async _sendRequest(method, endpoint, body = undefined) {
    const url = `${API_URL}/${endpoint}`;

    const headers = {
      'X-Api-Key': this.apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    };

    const options = { method, headers };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await this.fetchFn(url, options);

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    switch (response.status) {
      case 400:
        throw new ValidationException(data.parameter_errors);
      case 401:
        throw new UnauthorizedException();
      case 404:
        throw new NotFoundException();
      case 429:
        throw new RateLimitException();
      case 500:
        throw new ServerException();
    }

    return data;
  }

  async _get(endpoint) {
    return this._sendRequest('GET', endpoint);
  }

  async _delete(endpoint) {
    return this._sendRequest('DELETE', endpoint);
  }

  async _patch(endpoint, data) {
    return this._sendRequest('PATCH', endpoint, data);
  }

  async _post(endpoint, data) {
    return this._sendRequest('POST', endpoint, data);
  }

  async getProfileMe() {
    return this._get('me');
  }

  async getGroup(id) {
    return this._get(`groups/${id}`);
  }

  async getGroups(limit = null, fromId = null) {
    const params = new URLSearchParams();
    if (limit != null) params.set('limit', limit);
    if (fromId != null) params.set('from_id', fromId);
    const qs = params.toString();
    return this._get(qs ? `groups?${qs}` : 'groups');
  }

  async deleteGroup(id) {
    return this._delete(`groups/${id}`);
  }

  async updateGroup(id, data) {
    return this._patch(`groups/${id}`, data);
  }

  async createGroup(data) {
    return this._post('groups', data);
  }

  async getLink(id) {
    return this._get(`links/${id}`);
  }

  async getLinks(limit = null, fromId = null) {
    const params = new URLSearchParams();
    if (limit != null) params.set('limit', limit);
    if (fromId != null) params.set('from_id', fromId);
    const qs = params.toString();
    return this._get(qs ? `links?${qs}` : 'links');
  }

  async deleteLink(id) {
    return this._delete(`links/${id}`);
  }

  async updateLink(id, data) {
    return this._patch(`links/${id}`, data);
  }

  async createLink(data) {
    return this._post('links', data);
  }
}

module.exports = { ApiClient };
