import { Router } from "express";

import { UserController } from "../controllers/index.js";
import {
  adminVerify,
  counsellorVerify,
} from "../middlewares/auth.middlewares.js";

export const userRouter = Router();

userRouter.post("/signup", UserController.SignUp);
userRouter.post("/login", UserController.Login);
userRouter.post("/adminlogin", UserController.amdinLogin);
userRouter.post("/otp-for-password/:email", UserController.sendEmailOtp);
userRouter.post("/verifyotp", UserController.VerifyOtp);
userRouter.get("/getHistory", counsellorVerify, UserController.getHistory);
userRouter.get("/getHistoryByAdmin", adminVerify, UserController.getHistory);
userRouter.post("/password-reset-otp", UserController.passwordOtp);
userRouter.post("/verify-password-otp", UserController.VerifyPasswordResetOtp);
userRouter.post("/reset-password", UserController.resetPassword);
