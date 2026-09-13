export class InternalServerError extends Error {
  constructor({ cause }) {
    super("An unexpected error happened.", { cause });
    this.name = "InternalServerError";
    this.action = "Call support!";
    this.statusCode = 500;
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
