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

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super("An error happened during the data validation.", { cause });
    this.name = "NotFoundError";
    this.action = action;
    this.message = message;
    this.statusCode = 404;
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

export class AlreadyExistsError extends Error {
  constructor({ cause, message, action }) {
    super("An error happened during the data validation.", { cause });
    this.name = "AlreadyExistsError";
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

export class UnauthorizedError extends Error {
  constructor({ cause, message, action }) {
    super("An error happened during the data validation.", { cause });
    this.name = "UnauthorizedError";
    this.action = action || "Try to log in again";
    this.message = message;
    this.statusCode = 401;
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

export class AuthenticationError extends Error {
  constructor({ cause, message, action }) {
    super("Authentication error.", { cause });
    this.name = "AuthenticationError";
    this.action = action || "Try to log in again";
    this.message = message;
    this.statusCode = 401;
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

export class InvalidSessionError extends Error {
  constructor({ cause, message, action }) {
    super("Invalid session error.", { cause });
    this.name = "InvalidSessionError";
    this.action = action || "Try to log in again";
    this.message = message;
    this.statusCode = 401;
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
