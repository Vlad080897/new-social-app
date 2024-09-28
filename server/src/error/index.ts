export class HttpError extends Error {
  statusCode: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.statusCode = status;
    this.code = code;
  }
}
