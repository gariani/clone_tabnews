export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("An unexpected error happened.", { cause });
    this.name = "InternalServerError";
    this.action = "Call support!";
    this.statusCode = statusCode | 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Method not allowed to this endpoint.");
    this.name = "MethodNotAllowedError";
    this.action = "Check if the sent HTTP has the endpoint enabled.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause }) {
    super("Service unavailable.", { cause });
    this.name = "ServiceError";
    this.action = "Call support!";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super("An error happened during the data validation.", { cause });
    this.name = "ValidationError";
    this.action = action;
    this.message = message;
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
