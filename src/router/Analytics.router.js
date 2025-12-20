import { Router } from "express";
import { analyticsDashboard } from "../controllers/adminAnalytics.controller.js";
import { adminVerify } from "../middlewares/auth.middlewares.js";

export const analyticsRouter = Router();

analyticsRouter.get('/track',adminVerify,analyticsDashboard);