import { ErrorHandler, ApiResponse } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import fs from "fs";

const pdfParser = async (req, res) => {
  try {
    if (!req.file) {
      return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST);
    }

    console.log("Uploaded File Details:", req.file);

    const filePath = req.file.path;
    console.log("Received PDF file at:", filePath);

    if (!fs.existsSync(filePath)) {
      return new ErrorHandler(error.message, StatusCodes.NOT_FOUND);
    }

    // Code :- parse the PDF

    return res.status(200).json({ message: "Resume extracted successfully." });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export { pdfParser };
