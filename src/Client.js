'use strict';

const { ApiClient } = require('./http/ApiClient.js');
const { Groups } = require('./resources/Groups.js');
const { Links } = require('./resources/Links.js');
const { Profile } = require('./resources/Profile.js');

class Client {
  constructor(apiKey, fetchFn) {
    const apiClient = new ApiClient(apiKey, fetchFn);

    this._profile = new Profile(apiClient);
    this._groups = new Groups(apiClient);
    this._links = new Links(apiClient);
  }

  profile() {
    return this._profile;
  }

  groups() {
    return this._groups;
  }

  links() {
    return this._links;
  }
}

module.exports = { Client };
