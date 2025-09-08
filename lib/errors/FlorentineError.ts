export class FlorentineError extends Error {
  statusCode: number;
  errorCode: string;
  requestId: string;

  constructor({
    message,
    statusCode = 500,
    errorCode = 'UNKNOWN',
    requestId = ''
  }: {
    message: string;
    statusCode: number;
    errorCode: string;
    requestId?: string;
  }) {
    super(message);

    this.name = new.target.name; // gets the subclass name dynamically
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.requestId = requestId;

    // Restore prototype chain (important if transpiled)
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
      errorCode: this.errorCode,
      requestId: this.requestId
    };
  }
}
