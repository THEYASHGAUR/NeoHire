import express from "express";
import { authRouter, pdfRouter } from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// localhost:5000/api/auth/signup

app.use("/api/auth", authRouter);
app.use("/api/pdf-parser", pdfRouter);

app.use("/", (req, res) => {
  res.send("API is running...");
});
export { app };
