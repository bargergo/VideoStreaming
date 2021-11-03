export class HttpStatusError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'HttpStatusError';
  }
};