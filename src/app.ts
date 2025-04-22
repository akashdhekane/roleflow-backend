import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import customerRoutes from "./routes/customerRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import departmentRoutes from "./routes/departmentRoutes";
import taskCommentRoutes from "./routes/taskCommentRoutes";
import { errorHandler } from "./middleware/errorHandler";
import taskAttachmentRoutes from "./routes/taskAttachmentRoutes";
import taskHistoryRoutes from "./routes/taskHistoryRoutes";

dotenv.config();
const app = express();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || process.env.ALLOWED_ORIGINS === '*') {
            callback(null, true);
        } else {
            const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
            callback(allowedOrigins.includes(origin) ? null : new Error('Not allowed by CORS'), origin);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/task-comments", taskCommentRoutes);
app.use("/api/task-attachments", taskAttachmentRoutes);
app.use("/api/task-history", taskHistoryRoutes);
app.use(errorHandler);

export default app;
