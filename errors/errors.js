class NotFoundError extends Error {
  constructor(message) {
      super(message);
      this.statusCode = 404;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
      super(message);
      this.statusCode = 403;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
      super(message);
      this.statusCode = 401;
  }
}

class BadRequestError extends Error {
  constructor(message) {
      super(message);
      this.statusCode = 400;
  }
}

module.exports = { NotFoundError, ForbiddenError, UnauthorizedError, BadRequestError };
