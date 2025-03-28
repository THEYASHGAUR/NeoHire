import { Router } from "express";
import { pdfParser } from "../controllers/index.js";
import { upload } from "../middlewares/upload.middleware.js";

const pdfRouter = Router();

pdfRouter.route("/").get(upload.single("pdf"), pdfParser);

export { pdfRouter };
