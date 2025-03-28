import { Router } from "express";
import { LoginUser, RegisterUser } from "../controllers/index.js";

const authRouter = Router();

authRouter.route("/login").post(LoginUser);
authRouter.route("/signup").post(RegisterUser);

export { authRouter };
