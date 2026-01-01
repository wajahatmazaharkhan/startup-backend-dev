import { Router } from "express";
import { AdminController } from "../controllers/index.js";
import { adminVerify } from "../middlewares/auth.middlewares.js";

export const AdminRouter = Router();

AdminRouter.get("/get-all-users", adminVerify, AdminController.getAllUsers);
