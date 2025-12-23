import { Router } from "express";
import { addService, getAllService, getServiceBySlug , removeService , updateServiceByTitle } from "../controllers/index.js";

export const serviceRouter = Router();

serviceRouter.post("/add",addService);
serviceRouter.get("/getall",getAllService);
serviceRouter.get("/getbyslug/:slug",getServiceBySlug);
serviceRouter.delete("/remove/:title",removeService);
serviceRouter.put("/update/:oldTitle",updateServiceByTitle);

