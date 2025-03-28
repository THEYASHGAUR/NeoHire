import { StatusCodes } from "http-status-codes";

class ErrorHandler extends Error {
  constructor(message, status, error, success, stack) {
    super(message);
    this.message = message || "Something went wrong";
    this.success = success ?? false;
    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
    this.error = error || [];
    this.stack = stack || new Error().stack;
  }
}

export { ErrorHandler };
