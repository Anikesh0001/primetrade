import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { projectRoutes } from "./projectRoutes";
import { userRoutes } from "./userRoutes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/users", userRoutes);
