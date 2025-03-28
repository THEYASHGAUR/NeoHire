import { supabaseConfig } from "../config/supabaseConfig.js";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler, ApiResponse } from "../utils/index.js";

const RegisterUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabaseConfig.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST);
    }
    return;
    new ApiResponse(StatusCodes.OK, "User created successfully", data);
  } catch (error) {
    return new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabaseConfig.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST);
    }
    return;
    new ApiResponse(StatusCodes.OK, "User logged in successfully", data);
  } catch (error) {
    return new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export { RegisterUser, LoginUser };
