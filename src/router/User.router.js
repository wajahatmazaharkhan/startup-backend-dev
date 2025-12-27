import { Router } from "express";

import { UserController } from "../controllers/index.js";
import {
  adminVerify,
  counsellorVerify,
} from "../middlewares/auth.middlewares.js";

export const userRouter = Router();

userRouter.post("/signup", UserController.SignUp);
userRouter.post("/login", UserController.Login);
userRouter.post("/adminlogin", UserController.adminLogin);

//Email Verification routes
userRouter.post("/email-verification-otp/:email", UserController.sendEmailOtp);
userRouter.post("/verify-otp", UserController.VerifyOtp)

//History routes
userRouter.get("/getHistory", counsellorVerify, UserController.getHistory);
userRouter.get("/getHistoryByAdmin", adminVerify, UserController.getHistory);

//Password Reset Routes
userRouter.post("/password-reset-otp/:email", UserController.passwordOtp);
userRouter.post("/verify-password-otp", UserController.VerifyPasswordResetOtp);
userRouter.post("/reset-password", UserController.resetPassword);


