import { StatusCodes } from "http-status-codes";

class ApiResponse {
  constructor(status = StatusCodes.OK, message = "Success", data = null) {
    this.success = true;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
