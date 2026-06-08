'use strict';

class LixException extends Error {
  constructor(message = 'Lix API error') {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class HttpClientException extends LixException {
  constructor(message = 'HTTP client error') {
    super(message);
  }
}

class NotFoundException extends LixException {
  constructor() {
    super('Not found');
  }
}

class RateLimitException extends LixException {
  constructor() {
    super('Rate limit exceeded');
  }
}

class ServerException extends LixException {
  constructor() {
    super('Server error');
  }
}

class UnauthorizedException extends LixException {
  constructor() {
    super('Unauthorized');
  }
}

class ValidationException extends LixException {
  constructor(data) {
    super('Validation error');
    this.data = data;
  }
}

module.exports = {
  LixException,
  HttpClientException,
  NotFoundException,
  RateLimitException,
  ServerException,
  UnauthorizedException,
  ValidationException,
};
