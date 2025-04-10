import { Express } from "express";
import userRoutes from "./userRoutes";
import taskRoutes from "./taskRoutes";

export const registerRoutes = (app: Express) => {
  app.use("/api/users", userRoutes);
  app.use("/api/tasks", taskRoutes);
  // Register more entity routes as needed
};